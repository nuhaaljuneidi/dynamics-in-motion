(function(){
  "use strict";
  var LOGGER_URL="https://script.google.com/macros/s/AKfycbwmh8vX2n26GHHKq9yIGjy3fanmZ_XQddXHSH3RmrtV3HdhrpO27E3zZvXswCfN9QRpXg/exec";
  var config=window.DYNAMICS_RECORD||{};
  function el(id){return document.getElementById(id)}
  function value(id){return el(id).value.trim()}
  function validate(status){
    if(!value("studentName")){status.textContent="Please enter your name first.";el("studentName").focus();return false}
    if(value("studentEmail")&&!el("studentEmail").checkValidity()){status.textContent="Please check the email address or leave it blank.";el("studentEmail").focus();return false}
    return true
  }
  function detail(name,fallback){try{return typeof config[name]==="function"?config[name]():config[name]||fallback}catch(error){return fallback}}
  function payload(action){return new URLSearchParams({action:action,studentName:value("studentName"),email:value("studentEmail"),activity:detail("activity","Dynamics in Motion"),scenario:detail("scenario","Interactive activity"),displacement:"",distance:"",notes:value("studentNotes")+" | "+detail("results","No result summary")})}
  async function send(action,button,status){
    if(!validate(status))return;
    var original=button.textContent;button.disabled=true;button.textContent=action==="start"?"Recording…":"Submitting…";status.textContent=action==="start"?"Connecting to the activity log…":"Saving your engineering record…";
    try{await fetch(LOGGER_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:payload(action)});status.textContent=action==="start"?"Activity started. Your information was recorded.":"Work submitted. Your results were recorded.";button.textContent=action==="start"?"Activity Started":"Work Submitted"}
    catch(error){status.textContent="The record could not be sent. Check your connection and try again.";button.disabled=false;button.textContent=original}
  }
  function wrap(ctx,text,x,y,width,lineHeight,maxLines){var words=text.split(/\s+/),line="",lines=0;for(var i=0;i<words.length;i++){var test=line?line+" "+words[i]:words[i];if(ctx.measureText(test).width>width&&line){ctx.fillText(line,x,y);y+=lineHeight;line=words[i];if(++lines>=maxLines)return}else line=test}if(line)ctx.fillText(line,x,y)}
  function download(){
    var status=el("finalStatus");if(!validate(status))return;
    var canvas=document.createElement("canvas"),ctx=canvas.getContext("2d"),name=value("studentName");canvas.width=1600;canvas.height=1000;
    ctx.fillStyle="#f4f7fb";ctx.fillRect(0,0,1600,1000);ctx.fillStyle="#002855";ctx.fillRect(0,0,1600,205);ctx.fillStyle="#ffcc00";ctx.fillRect(0,0,1600,10);
    ctx.fillStyle="#fff";ctx.font="700 34px 'Source Sans 3',Arial";ctx.fillText("Dr. Nuha Aljuneidi",60,65);ctx.fillStyle="#ffcc00";ctx.font="600 18px 'Source Code Pro',monospace";ctx.fillText("DYNAMICS IN MOTION · STUDENT SOLUTION RECORD",60,108);ctx.fillStyle="#fff";ctx.font="700 44px 'Source Sans 3',Arial";ctx.fillText(detail("activity","Dynamics Activity"),60,166);
    ctx.fillStyle="#10243e";ctx.font="700 24px 'Source Sans 3',Arial";ctx.fillText("Student: "+name,60,260);ctx.font="20px 'Source Sans 3',Arial";ctx.fillText("Date: "+new Date().toLocaleString(),60,298);
    ctx.fillStyle="#fff";ctx.fillRect(60,340,1480,205);ctx.strokeStyle="#d9e3ef";ctx.strokeRect(60,340,1480,205);ctx.fillStyle="#005eb8";ctx.font="700 25px 'Source Sans 3',Arial";ctx.fillText("Generated Scenario",95,390);ctx.fillStyle="#10243e";ctx.font="22px 'Source Sans 3',Arial";wrap(ctx,detail("scenario","Interactive activity"),95,435,1370,32,3);
    ctx.fillStyle="#fff";ctx.fillRect(60,575,1480,175);ctx.strokeRect(60,575,1480,175);ctx.fillStyle="#005eb8";ctx.font="700 25px 'Source Sans 3',Arial";ctx.fillText("Results",95,625);ctx.fillStyle="#10243e";ctx.font="22px 'Source Sans 3',Arial";wrap(ctx,detail("results","No result summary"),95,670,1370,32,2);
    ctx.fillStyle="#002855";ctx.font="700 25px 'Source Sans 3',Arial";ctx.fillText("Engineering Interpretation",60,805);ctx.fillStyle="#334b64";ctx.font="20px 'Source Sans 3',Arial";wrap(ctx,value("studentNotes")||"No interpretation provided.",60,848,1480,29,3);
    ctx.fillStyle="#002855";ctx.fillRect(0,960,1600,40);ctx.fillStyle="#fff";ctx.font="15px 'Source Sans 3',Arial";ctx.fillText("Dynamics in Motion · Developed by Dr. Nuha Aljuneidi",60,986);
    var link=document.createElement("a");link.download="dynamics-solution-"+name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".png";link.href=canvas.toDataURL("image/png");link.click();status.textContent="Solution image downloaded."
  }
  el("startActivity").addEventListener("click",function(){send("start",this,el("submitStatus"))});
  el("submitWork").addEventListener("click",function(){send("complete",this,el("finalStatus"))});
  el("downloadSolution").addEventListener("click",download);
})();
