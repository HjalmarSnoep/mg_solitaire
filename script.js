var game={};
var end={};
var seven={};
var stack={};
var open={};
var mouse={};
var card_width=70;
var card_height=100;

window.addEventListener("load",init);

function hussle(a,b)
{
	if(Math.random()<0.5) return -1;
	return 1;
}
function startOver()
{
	window.location.reload();
}
function resizeGame(ev)
{
	// size up the container.
	var game_dom=document.getElementById("game");
	var rect=game_dom.getBoundingClientRect();
	var fx=window.innerWidth/rect.width;
	var fy=window.innerHeight/rect.height;
	var f=fy;
	if(fx<fy)f=fx;
	
	card_width=window.innerWidth/16;
	card_height=100*card_width/70;
	if(card_height>window.innerHeight/6)
	{
		card_height=window.innerHeight/6;
		card_width=70*card_height/100;
	}
	
}
function init()
{
	console.log(location.href);
	if(location.href.indexOf("https://www.makinggames.org/")!=0 && 
	location.href.indexOf("http://www.makinggames.org/")!=0 && 
	location.href.indexOf("file:")!=0) return;
	var nr=Math.floor(Math.random()*10);
	window.addEventListener("resize",resizeGame);
	var container=document.createElement("div");
	container.style.backgroundImage = "url(backgrounds/background"+nr+".jpg)";
	container.id="container";
	document.body.appendChild(container);
	
	// copyright unsplash.
	var copy=document.createElement("div");
	copy.style.position="absolute";
	copy.style.bottom="10px";
	copy.style.right="10px";
	copy.style.opacity=0.4;
	copy.style.fontSize="0.7em";
	copy.innerHTML="&copy; Background images from unsplash.<br>&copy; Game Hjalmar Snoep";
	container.appendChild(copy);
	
	
	// creates basic containers.
	// sets the data model, calls refresh().
	var button=document.createElement("button");
	button.innerHTML="Nieuw spel";
	button.addEventListener("click",startOver);
	container.appendChild(button);
	
	
	game.dom=document.createElement("div");
	game.dom.id="game";
	container.appendChild(game.dom);
	resizeGame();
	
	var h1=document.createElement("h1");
	h1.innerHTML="Raagi's Gratis Solitaire";
	h1.style.margin="0px";
	h1.style.padding="15px";
	game.dom.appendChild(h1);

	var row=document.createElement("div");
	row.className="row";
	game.dom.appendChild(row);

	stack.dom=document.createElement("div");
	stack.dom.id="stack";
	stack.dom.style.width=card_width+"px"
	stack.position=0;
	stack.model=[];
	for(var i=0;i<52;i++) stack.model[i]=i+1;
	stack.model.sort(hussle);
	stack.model.sort(hussle);
	stack.model.sort(hussle);
	console.log(stack.model);
	stack.dom.addEventListener("click",getThreeNew);
	stack.dom.innerHTML="<img className='card' src='cards/cards0000.png'>";
	row.appendChild(stack.dom);
	
	open.dom=document.createElement("div");
	open.dom.id="open";
	open.dom.style.width=card_width*2+"px";
	open.dom.style.height=(card_height*1)+"px";
	// show three cards 
	open.stack=[];
	open.model=[];
	for(var i=0;i<3;i++) 
	{
		open.stack[i]={};
		open.stack[i].dom=document.createElement("div");
		open.stack[i].dom.id="open"+i;
		open.stack[i].dom.className="open";
		open.stack[i].dom.style.position="absolute";
		open.stack[i].dom.style.left=(i*card_width/5)+"px";
		open.dom.appendChild(open.stack[i].dom);
	}
	row.appendChild(open.dom);

	end.dom=document.createElement("div");
	end.dom.id="end";
	row.appendChild(end.dom);
	
	// maak de aas-stapels.
	end.model=[];
	end.stack=[];
	for(var i=0;i<4;i++) 
	{
		end.model[i]=[];
		end.stack[i]={};
		end.stack[i].dom=document.createElement("div");
		end.stack[i].dom.addEventListener("dragover", function( event ) {
				// prevent default to allow drop
				event.preventDefault();
		}, false);
		end.stack[i].dom.setAttribute("nr",i);
		end.stack[i].dom.id="stack"+i;
		end.stack[i].dom.className="placeholder";
		end.stack[i].dom.style.width=card_width+"px";
		end.stack[i].dom.style.height=card_height+"px";
		end.dom.appendChild(end.stack[i].dom);
	}
	
	var row=document.createElement("div");
	row.className="row";
	game.dom.appendChild(row);
	
	seven.dom=document.createElement("div");
	seven.dom.id="seven";
	row.appendChild(seven.dom);
	// create 7 placeholders, they don't matter, but still..
	// we have to make them somewhere..
	var placeholders=document.createElement("div");
	placeholders.style.position="absolute";
	placeholders.style.top="15px";
	placeholders.style.zIndex="-1";
	placeholders.style.left="15px";
	row.appendChild(placeholders);
	for(var i=0;i<7;i++)
	{
		var temp=document.createElement("div");
		temp.className="placeholder";
		placeholders.appendChild(temp);
	}
	
	// maak de 7 stapeltjes.
	seven.stack=[];
	seven.model=[];
	for(var i=0;i<7;i++)
	{
		seven.stack[i]={};
		seven.model[i]=[];
		for(var j=0;j<i+1;j++)
		{
			// push top cards of stack onto this.
			seven.model[i][j]=stack.model.pop();
		}
		seven.stack[i].openfrom=i-1;
		seven.stack[i].dom=document.createElement("div");
		seven.stack[i].dom.style.width=card_width+"px";
		seven.stack[i].dom.setAttribute("nr",i);
		seven.stack[i].dom.id="seven"+i;
		seven.stack[i].dom.className="stack";
		seven.stack[i].cards=[]; // here we can put the cards dom.
		seven.dom.appendChild(seven.stack[i].dom);
	}
	// create your own drag, cause normal implementation sucks.
	document.addEventListener("pointermove",updateMouse);
	// create a drag layer to show what we are dragging
	drag={};
	drag.model=[];
	drag.dom=document.createElement("div");
	game.dom.appendChild(drag.dom);
	drag.dom.id="drag";
	refresh();
}

function refresh()
{
	resizeGame();
	// shows the data model, 
	// makes everything draggable that needs to
	// be draggable.
	
	// check if last move made you win..
	var cards_on_end=end.model[0].length+end.model[1].length+end.model[2].length+end.model[3].length;
	console.log("cards_on_end "+cards_on_end);
    if(cards_on_end==52)
	{
		// goto end!
		console.log("you won!");
	}

    // show stack? or click to start over thingy
	if(stack.model.length!=0)
	{
		// ended game?
		// show a stack of cards??
		stack.dom.innerHTML="<img class='card' width='"+card_width+"px' src='cards/cards0000.png'>";
	}else{
		stack.dom.innerHTML=""; // NO card
		stack.dom.className='placeholder';
		// check if we are done..
		
	}
	
	// show all cards in open stack
	var last_card=null;
	for(var i=0;i<3;i++) 
	{
		open.stack[i].dom.innerHTML=""; // deletes any cards;
		if(open.model.length>i)
		{
			var img=document.createElement("img");
			img.className="card";
			img.width=card_width;
			img.height=card_height;
			img.src=toCardName(open.model[i]);
			open.stack[i].dom.appendChild(img);
			open.stack[i].dom.style.position="absolute";
			open.stack[i].dom.style.left=(i*card_width/4)+"px";
			open.stack[i].dom.style.top="0px";
			last_card=img;
		}
	}
	if(last_card!=null) last_card.addEventListener("pointerdown",startDraggingFromOpen);


	// maak de aas-stapels.
	for(var i=0;i<4;i++) 
	{
		end.stack[i].dom.innerHTML="";
		if(end.model[i].length!=0)
		{
			var j=end.model[i].length-1;
			var img=document.createElement("img"); // show ONLY last card!
			img.className="card";
			img.width=card_width;
			img.height=card_height;

			img.src=toCardName(end.model[i][j]);
			end.stack[i].dom.appendChild(img);
		}
	}

	// maak de 7 stapeltjes.
	for(var i=0;i<7;i++)
	{
		seven.stack[i].dom.innerHTML="";
		for(var j=0;j<seven.model[i].length;j++)
		{
			seven.stack[i].cards[j]={};
			seven.stack[i].cards[j].dom=document.createElement("img");
			seven.stack[i].cards[j].dom.width=card_width;
			seven.stack[i].cards[j].dom.height=card_height;
			seven.stack[i].cards[j].dom.className="card";
			seven.stack[i].cards[j].dom.style.position="absolute";
			seven.stack[i].cards[j].dom.style.top=(15+j*card_height/5)+"px";
			if(j>seven.stack[i].openfrom)
			{
				seven.stack[i].cards[j].dom.src=toCardName(seven.model[i][j]);
				seven.stack[i].cards[j].dom.setAttribute("row",i);
				seven.stack[i].cards[j].dom.setAttribute("nr",j);
				seven.stack[i].cards[j].dom.id="seven_"+i+"_"+j;
				seven.stack[i].cards[j].dom.addEventListener("pointerdown",startDragFromSeven);
			}else{
				seven.stack[i].cards[j].dom.src=toCardName(0); // show back
				seven.stack[i].cards[j].dom.setAttribute("row",i);
				seven.stack[i].cards[j].dom.setAttribute("nr",j);
				seven.stack[i].cards[j].dom.id="seven_"+i+"_"+j;
				// make the back clickable if this is ALSO the end of the row!
				if(seven.model[i].length-1==seven.stack[i].openfrom)
				{
					seven.stack[i].cards[j].dom.addEventListener("click",openSevenCard);
				}
			}
			seven.stack[i].dom.appendChild(seven.stack[i].cards[j].dom);
		}
	}
}
function openSevenCard(ev)
{
	var row=ev.currentTarget.getAttribute("row");
	console.log("openSevenCard "+row);
	seven.stack[row].openfrom--;
	refresh();
}
function updateMouse(e)
{
    var rect = document.getElementById("game").getBoundingClientRect();
    mouse.x = e.clientX - rect.left; //x position within the element.
    mouse.y = e.clientY - rect.top;  //y position within the element.
}


function toCardName(nr)
{
	if(nr<10) nr="000"+nr;
	else nr="00"+nr;
	return "cards/cards"+nr+".png";
}
function startDragFromSeven(ev)
{
	var row=ev.currentTarget.getAttribute("row");
	var nr=ev.currentTarget.getAttribute("nr");
	console.log("startDragFromSeven:"+row,nr,seven.model[row]);
	
	drag.origin="seven";
	drag.origin_row=row;
	// copy these to drag model!
	drag.model=[];
	drag.dom.innerHTML="";
	console.log("row length:"+seven.model[row].length);

	var pos_on_drag=0;
	for(var i=nr;i<seven.model[row].length;i++)
	{
		var card_to_copy=document.getElementById("seven_"+row+"_"+i);
		console.log("copy card: seven_"+row+"_"+i);
		drag.dom.appendChild(card_to_copy);
		card_to_copy.style.top=(pos_on_drag*card_height/5)+"px";
		card_to_copy.style.pointerEvents="none";// temporarily see through as long as we are in draggable.
		drag.model.push(seven.model[row][i]);
		pos_on_drag++;
	}
	// take them of the model as well..
	seven.model[row].splice(nr,seven.model[row].length-nr); 
	
	
	console.log("stack model is now: : "+seven.model[row]);
	console.log("drag model: "+drag.model);
	drag.dom.addEventListener("pointerup",dragEnd);
	drag.dom.style.display="block";
	drag.dom.style.position="absolute";
	drag.dragging=true;
	dragging();
}
function startDraggingFromOpen(ev)
{
	console.log("startDraggingFromOpen");
	drag.origin="open";
	console.log("drag FROM "+drag.origin);
	drag.model=[];
	drag.dom.innerHTML="";
	drag.model.push(open.model.pop());// remove the card from the open stack..
	
	drag.dom.appendChild(ev.currentTarget);
	drag.dom.addEventListener("pointerup",dragEnd);
	ev.currentTarget.style.pointerEvents="none";// temporarily see through as long as we are in draggable.
	drag.dom.style.display="block";
	drag.dom.style.position="absolute";
	drag.dragging=true;
	dragging();
}
function dragEnd()
{
	drag.dragging=false;
	drag.dom.style.display="none";
	drag.dom.firstChild.style.pointerEvents="";// remove see through!
	// find out WHERE user dragged.
	// check last cards of seven.
	var rect=game.dom.getBoundingClientRect();
	var x=mouse.x+rect.x;
	var y=mouse.y+rect.y;
	for(var i=0;i<7;i++)
	{
		var rect=seven.stack[i].dom.getBoundingClientRect();
		if(x>rect.x && x<(rect.x+rect.width)
			&&
		    y>rect.y && y<(rect.y+rect.height) )
		{
			console.log("you dropped on stack: "+i);
			var allowed=true;
			if(seven.model[i].length!=0) // no card is ALWAYS allowed.
			{
				var last_card=seven.model[i][seven.model[i].length-1]-1;
				var this_card=drag.model[0]-1;
				var last_card_nr=last_card%13;
				var this_card_nr=this_card%13;
				var last_card_color=Math.floor(last_card/13)%2;
				var this_card_color=Math.floor(this_card/13)%2;
				console.log("this card "+this_card_nr+" "+this_card_color);
				console.log("seven stack card "+last_card_nr+" "+last_card_color);
				if(this_card_color==last_card_color) allowed=false;
				if(this_card_nr!=(last_card_nr-1)) 
				{
					allowed=false;
					console.log(this_card_nr,last_card_nr);
				}
			}
			if(allowed)
			{
				for(var m=0;m<drag.model.length;m++)
				{
					seven.model[i].push(drag.model[m]);
				}
				drag.model=[];
				refresh();
				return;
			}else{
				console.log("drop on stack not allowed");
			}
		}
	}
	for(var i=0;i<4;i++)
	{
		var rect=end.stack[i].dom.getBoundingClientRect();
		if(x>rect.x && x<(rect.x+rect.width)
			&&
		    y>rect.y && y<(rect.y+rect.height) )
		{
			for(var m=0;m<drag.model.length;m++)
			{
				console.log("you dropped on end-stack: "+i);
				var allowed=true;
				var this_card=drag.model[0]-1;
				var this_card_nr=this_card%13;
				var this_card_color=Math.floor(this_card/13);
				console.log("end drop of card nr: "+this_card_nr)
				console.log("End model stack length "+end.model[i].length);
				if(end.model[i].length==0 && this_card_nr==0) // if last card and ace
				{
					// that's allowed!
					console.log("dropped and ace!");
				}else{
					var last_card=end.model[i][end.model[i].length-1]-1;
					var last_card_nr=last_card%13;
					var last_card_color=Math.floor(last_card/13);
					console.log("dropping on endcard: "+last_card_nr);
					if(last_card_color!=this_card_color)
					{
						console.log("drop on end not allowed, not right color");
						allowed=false;
					}
					if(last_card_nr!=(this_card_nr-1))
					{
						console.log("drop on end not allowed, not consecutive");
						allowed=false;
					}
				}
				if(allowed)
				{
					end.model[i].push(drag.model[m]);
					refresh();
					return;
				}else{
					console.log("drop on end not allowed");
				}
			}

		}
	}
	// not accepted?
	switch(drag.origin)
	{
		case "open":
			// off load the drag model to open!
			open.model.push(drag.model[0]);
			refresh();
		break;
		case "seven":
			
			for(var i=0;i<drag.model.length;i++)
			{
				seven.model[drag.origin_row].push(drag.model[i]);
			}
			refresh();
		break;
	}
	refresh(); // after we release dragging, we show the new situation of the data!
}
function dragging()
{
	drag.dom.style.left=(mouse.x-35)+"px";
	drag.dom.style.top=(mouse.y-10)+"px";
	if(drag.dragging==true)
		window.requestAnimationFrame(dragging);
}
function getThreeNew(ev)
{
	// edit the data model!
	for(var i=0;i<3;i++) 
	{
		if(open.model.length!=0)
			stack.model.unshift(open.model.pop());
	}
	for(var i=0;i<3;i++) 
	{
		if(stack.model.length!=0)
		open.model.push(stack.model.pop());
	}
//	console.log("stack:"+stack.model)
//	console.log("open: "+open.model)
	refresh();
}
