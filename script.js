var game={};
var end={};
var seven={};
var stack={};
var open={};
var mouse={};
init();
function hussle(a,b)
{
	if(Math.random()<0.5) return -1;
	return 1;
}
function init()
{
	// creates basic containers.
	// sets the data model, calls refresh().
	var button=document.createElement("button");
	button.innerHTML="Nieuw spel";
	document.body.appendChild(button);
	
	var button=document.createElement("button");
	button.innerHTML="Volledig scherm";
	document.body.appendChild(button);
	
	game.dom=document.createElement("div");
	game.dom.id="game";
	document.body.appendChild(game.dom);
	var h1=document.createElement("h1");
	h1.innerHTML="Raagi's Gratis Solitaire";
	game.dom.appendChild(h1);

	var row=document.createElement("div");
	row.className="row";
	game.dom.appendChild(row);

	stack.dom=document.createElement("div");
	stack.dom.id="stack";
	stack.position=0;
	stack.cards=[];
	for(var i=0;i<52;i++) stack.cards[i]=i+1;
	stack.cards.sort(hussle);
	stack.cards.sort(hussle);
	stack.cards.sort(hussle);
	console.log(stack.cards);
	stack.dom.addEventListener("click",getThreeNew);
	stack.dom.innerHTML="<img src='cards/cards0000.png'>";
	row.appendChild(stack.dom);
	
	open.dom=document.createElement("div");
	open.dom.id="open";
	
	// show three cards as open
	open.stack=[];
	for(var i=0;i<3;i++) 
	{
		open.stack[i]={};
		open.stack[i].dom=document.createElement("div");
		open.stack[i].dom.id="open"+i;
		open.stack[i].dom.className="open";
		//var img=document.createElement("img");
		//img.src='cards/cards0001.png';
		//open.stack[i].dom.appendChild(img);
		open.stack[i].dom.style.position="absolute";
		open.stack[i].dom.style.left=(i*20)+"px";
		open.dom.appendChild(open.stack[i].dom);
	}
	row.appendChild(open.dom);

	end.dom=document.createElement("div");
	end.dom.id="end";
	row.appendChild(end.dom);
	
	// maak de aas-stapels.
	end.stack=[];
	for(var i=0;i<4;i++) 
	{
		end.stack[i]={};
		end.stack[i].dom=document.createElement("div");
		end.stack[i].dom.addEventListener("dragover", function( event ) {
				// prevent default to allow drop
				event.preventDefault();
		}, false);
		end.stack[i].dom.setAttribute("nr",i);
		end.stack[i].dom.id="stack"+i;
		end.stack[i].dom.className="end";
		end.dom.appendChild(end.stack[i].dom);
	}
	
	var row=document.createElement("div");
	row.className="row";
	game.dom.appendChild(row);
	
	seven.dom=document.createElement("div");
	seven.dom.id="seven";
	row.appendChild(seven.dom);
	// maak de 7 stapeltjes.
	seven.stack=[];
	for(var i=0;i<7;i++)
	{
		seven.stack[i]={};
		seven.stack[i].dom=document.createElement("div");
		seven.stack[i].dom.setAttribute("nr",i);
		seven.stack[i].dom.addEventListener("dragover", function( event ) {
				// prevent default to allow drop
				event.preventDefault();
		}, false);
		
		seven.stack[i].dom.id="seven"+i;
		seven.stack[i].cards=[];
		for(var j=0;j<i+1;j++)
		{
			seven.stack[i].cards[j]={};
			seven.stack[i].cards[j].dom=document.createElement("img");
			seven.stack[i].cards[j].dom.src='cards/cards0000.png';
			seven.stack[i].cards[j].dom.style.position="absolute";
			seven.stack[i].cards[j].dom.style.top=(15+j*25)+"px";
			if(j==i)
			{
				seven.stack[i].cards[j].dom.src='cards/cards0001.png';
			}
			seven.stack[i].dom.appendChild(seven.stack[i].cards[j].dom);
		}
		seven.stack[i].dom.className="stack";
		seven.dom.appendChild(seven.stack[i].dom);
	}
	// create your own drag, cause normal implementation sucks.
	document.addEventListener("pointermove",updateMouse);
	// create a drag layer to show what we are dragging
	drag={};
	drag.dom=document.createElement("div");
	game.dom.appendChild(drag.dom);
	drag.dom.id="drag";
	//getThreeNew();
}

function refresh()
{
	// shows the data model, 
	// makes everything draggable that needs to
	// be draggable.

    // show stack? or click to start over thingy
	
	// show all cards in open stack
	for(var i=0;i<3;i++) 
	{
     	open.stack[i].dom.innerHTML="";
		// clear the stack, put images in.
	}

	// maak de aas-stapels.
	for(var i=0;i<4;i++) 
	{
		end.stack[i].dom.innerHTML="";
	}

	// maak de 7 stapeltjes.
	for(var i=0;i<7;i++)
	{
		seven.stack[i].dom.innerHTML="";
		for(var j=0;j<seven.stack[i].cards.length;j++)
		{
			seven.stack[i].cards[j]={};
			seven.stack[i].cards[j].dom=document.createElement("img");
			seven.stack[i].cards[j].dom.src='cards/cards0000.png';
			seven.stack[i].cards[j].dom.style.position="absolute";
			seven.stack[i].cards[j].dom.style.top=(15+j*25)+"px";
			if(j==i)
			{
				seven.stack[i].cards[j].dom.src='cards/cards0001.png';
			}
			seven.stack[i].dom.appendChild(seven.stack[i].cards[j].dom);
		}
	}
}

function updateMouse(e)
{
    var rect = document.getElementById("game").getBoundingClientRect();
    mouse.x = e.clientX - rect.left; //x position within the element.
    mouse.y = e.clientY - rect.top;  //y position within the element.
}

function dropOnEnd()
{
		drag.dragging=false;
	console.log("dropOnEnd"+ev.currentTarget.getAttribute("nr"));
}
function toCardName(nr)
{
	if(nr<10) nr="000"+nr;
	else nr="00"+nr;
	return "cards/cards"+nr+".png";
}
function startedDrag(ev)
{
	console.log("started draggin: "+ev.currentTarget);
}
function startDraggingFromOpen(ev)
{
	console.log("startDraggingFromOpen");
	// check if it is the last card!!
	if(1)
	{
//		ev.currentTarget.style.display="none";
		// now copy it to drag.
		drag.origin=ev.currentTarget.parentNode;
		console.log("drag FROM "+drag.origin.id);
		drag.dom.appendChild(ev.currentTarget);
		drag.dom.addEventListener("pointerup",dragEnd);
		ev.currentTarget.style.pointerEvents="none";// temporarily see through as long as we are in draggable.
		drag.dom.style.display="block";
		drag.dom.style.position="absolute";
		drag.dragging=true;
		dragging();
	}
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
			var new_card=drag.dom.firstChild;
			seven.stack[i].dom.appendChild(new_card);
			console.log("stack has "+seven.stack[i].dom.children.length+"children");
			new_card.style.top=((seven.stack[i].dom.children.length-1)*25+15)+"px";
			new_card.removeEventListener("pointerdown",startDraggingFromOpen);
			return;
		}
	}
	for(var i=0;i<4;i++)
	{
		var rect=end.stack[i].dom.getBoundingClientRect();
		if(x>rect.x && x<(rect.x+rect.width)
			&&
		    y>rect.y && y<(rect.y+rect.height) )
		{
			console.log("you dropped on end: "+i);
			end.stack[i].dom.innerHTML="";
			end.stack[i].dom.appendChild(drag.dom.firstChild);
			return;
		}
	}
	// not accepted?
	drag.origin.appendChild(drag.dom.firstChild);
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
	stack.dom.style.opacity=1;// still clickable.
	stack.position+=3;
	console.log("three new cards");
	var last_card=null;
	for(var i=0;i<3;i++) 
	{
		open.stack[i].dom.innerHTML=""; // deletes any cards;
		var nr=i+stack.position;
		if(nr<stack.cards.length)
		{
			var img=document.createElement("img");
			img.src=toCardName(stack.cards[nr]);
			open.stack[i].dom.appendChild(img);
			open.stack[i].dom.style.position="absolute";
			open.stack[i].dom.style.left=(i*20)+"px";
			img.addEventListener("pointerdown",startDraggingFromOpen);
			open.dom.appendChild(open.stack[i].dom);
		}else{
			// remove the back card.
			stack.dom.style.opacity=0.1;// still clickable.
			stack.position=-3;
		}
	}
}
