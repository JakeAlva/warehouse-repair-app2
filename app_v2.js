
// Fill repair height dropdown 2'-16'
const repairHeightSelect = document.getElementById('repairHeight');
for (let i=2;i<=16;i++){ let opt = document.createElement('option'); opt.textContent=i+"’"; repairHeightSelect.appendChild(opt); }

const page1=document.getElementById('page1');
const page2=document.getElementById('page2');
const toPage2=document.getElementById('toPage2');
const backToFrames=document.getElementById('backToFrames');
const nextDamage=document.getElementById('nextDamage');
const exportExcel=document.getElementById('exportExcel');
const strutsNeeded=document.getElementById('strutsNeeded');
const strutDetails=document.getElementById('strutDetails');
const damageTitle=document.getElementById('damageTitle');

let frameCount=1;
let damageCount=1;
let frames=[];
let currentFrame=null;

// Show/hide strut details
strutsNeeded.addEventListener('change',(e)=>{ strutDetails.classList.toggle('hidden',e.target.value!=="Yes"); });

// Go to Page 2
toPage2.addEventListener('click',()=>{
    currentFrame={
        frameLabel:"Frame "+frameCount,
        depth:document.getElementById('depth').value,
        width:document.getElementById('width').value,
        strutSizes:document.getElementById('strutSizes').value,
        footplate:document.getElementById('footplate').value,
        strutHeights:document.getElementById('strutHeights').value,
        holePunch:document.getElementById('holePunch').value,
        color:document.getElementById('color').value,
        manufacturer:document.getElementById('manufacturer').value,
        damages:[]
    };
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
    damageCount=1;
    damageTitle.textContent="Damage Entry "+damageCount;
});

// Back to Page 1 to add new frame
backToFrames.addEventListener('click',()=>{
    if(currentFrame.damages.length>0 || currentFrame) frames.push(currentFrame);
    page2.classList.add('hidden');
    page1.classList.remove('hidden');
    frameCount++;
    // Clear page1 inputs
    ['depth','width','strutSizes','footplate','strutHeights','holePunch','color'].forEach(id=>document.getElementById(id).value='');
});

// Add damage and reset page2 for next entry
nextDamage.addEventListener('click',()=>{
    const damage={
        damageLocation:document.getElementById('damageLocation').value,
        repairType:document.getElementById('repairType').value,
        repairHeight:document.getElementById('repairHeight').value,
        beamHeight:document.getElementById('beamHeight').value,
        strutsNeeded:document.getElementById('strutsNeeded').value,
        diagStruts:document.getElementById('diagStruts').value,
        horizStruts:document.getElementById('horizStruts').value
    };
    currentFrame.damages.push(damage);
    damageCount++;
    damageTitle.textContent="Damage Entry "+damageCount;
    // Clear inputs for next damage
    ['damageLocation','beamHeight','diagStruts','horizStruts'].forEach(id=>document.getElementById(id).value='');
});

// Export all frames + damages to CSV
exportExcel.addEventListener('click',()=>{
    if(currentFrame) frames.push(currentFrame);
    if(frames.length===0){ alert("No data to export"); return; }
    let csv="Frame,Depth,Width,Strut Sizes,Footplate,Strut Heights,Hole Punch,Color,Manufacturer,Damage Location,Repair Type,Repair Height,Beam Level Height,Struts Needed,Diagonal Struts,Horizontal Struts\n";
    frames.forEach(f=>{
        f.damages.forEach(d=>{
            csv+=`${f.frameLabel},${f.depth},${f.width},${f.strutSizes},${f.footplate},${f.strutHeights},${f.holePunch},${f.color},${f.manufacturer},${d.damageLocation},${d.repairType},${d.repairHeight},${d.beamHeight},${d.strutsNeeded},${d.diagStruts},${d.horizStruts}\n`;
        });
    });
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download="frames_v2.csv";a.click();
    URL.revokeObjectURL(url);
    alert("Exported CSV successfully!");
});
