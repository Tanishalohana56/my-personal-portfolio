const STORAGE_KEY = "modern_gpa_v2";
const THEME_KEY = "modern_gpa_theme";

const semestersEl = document.getElementById("semesters");
const addSemesterBtn = document.getElementById("addSemesterBtn");
const newSemesterName = document.getElementById("newSemesterName");
const cgpaVal = document.getElementById("cgpaVal");
const totalCreditsEl = document.getElementById("totalCredits");
const modalBackdrop = document.getElementById("modalBackdrop");
const semesterModal = document.getElementById("semesterModal");
const modalSemesterName = document.getElementById("modalSemesterName");
const modalSaveSemester = document.getElementById("modalSaveSemester");
const modalCancelSemester = document.getElementById("modalCancelSemester");
const modalDeleteSemester = document.getElementById("modalDeleteSemester");
const modalExportSemester = document.getElementById("modalExportSemester");
const courseModal = document.getElementById("courseModal");
const modalCourseTitle = document.getElementById("modalCourseTitle");
const modalCourseCredits = document.getElementById("modalCourseCredits");
const modalCourseMid = document.getElementById("modalCourseMid");
const modalCourseSessional = document.getElementById("modalCourseSessional");
const modalCourseFinal = document.getElementById("modalCourseFinal");
const totalMarksDisplay = document.getElementById("totalMarksDisplay");
const modalSaveCourse = document.getElementById("modalSaveCourse");
const modalCancelCourse = document.getElementById("modalCancelCourse");
const modalDeleteCourse = document.getElementById("modalDeleteCourse");
const exportAllBtn = document.getElementById("exportAllBtn");

let state = { semesters: [] };
let activeSemesterId = null;
let activeCourseId = null;

function uid() { return "id" + Math.random().toString(16).slice(2); }
function escapeHtml(str) { 
  return String(str || "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); 
}
function showModal(modal){ if(modal){ modal.style.display="block"; modalBackdrop.style.display="block"; } }
function hideModal(modal){ if(modal){ modal.style.display="none"; modalBackdrop.style.display="none"; } }

function marksToGrade(m){
  const marks = Number(m);
  if (marks >= 85) return { grade: "A", point: 4.00 };
  if (marks >= 80) return { grade: "A-", point: 3.67 };
  if (marks >= 75) return { grade: "B+", point: 3.33 };
  if (marks >= 70) return { grade: "B", point: 3.00 };
  if (marks >= 65) return { grade: "B-", point: 2.67 };
  if (marks >= 61) return { grade: "C+", point: 2.50 };
  if (marks >= 58) return { grade: "C", point: 2.00 };
  if (marks >= 55) return { grade: "C-", point: 1.67 };
  if (marks >= 53) return { grade: "D+", point: 1.33 }; 
  if (marks >= 50) return { grade: "D", point: 1.00 };
  return { grade: "F", point: 0.00 };
}

function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {} }
function load() { try { const raw = localStorage.getItem(STORAGE_KEY); if(raw) state = JSON.parse(raw); } catch(e){ state={semesters:[]} } }

function setTheme(mode){
  if(mode==="dark"){ document.body.classList.remove("light"); document.body.classList.add("dark"); }
  else{ document.body.classList.remove("dark"); document.body.classList.add("light"); }
  localStorage.setItem(THEME_KEY, mode);
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  setTheme(saved);
}
document.getElementById("themeToggle")?.addEventListener("change", e=>setTheme(e.target.checked?"dark":"light"));

function openSemesterModal(sid){
  activeSemesterId = sid;
  const sem = state.semesters.find(s=>s.id===sid);
  if(!sem) return;
  modalSemesterName.value = sem.name;
  showModal(semesterModal);
}
modalSaveSemester?.addEventListener("click", ()=>{
  if(!activeSemesterId) return;
  const sem = state.semesters.find(s=>s.id===activeSemesterId);
  if(!sem) return;
  sem.name = modalSemesterName.value.trim()||sem.name;
  hideModal(semesterModal);
  activeSemesterId = null;
  render();
});
modalCancelSemester?.addEventListener("click", ()=>{ hideModal(semesterModal); activeSemesterId=null; });
modalDeleteSemester?.addEventListener("click", ()=>{
  if(!activeSemesterId) return;
  if(confirm("Delete this semester?")){
    state.semesters = state.semesters.filter(s=>s.id!==activeSemesterId);
    hideModal(semesterModal); activeSemesterId=null; render();
  }
});
modalExportSemester?.addEventListener("click", ()=>{
  if(!activeSemesterId) return;
  exportSemesterPDF(activeSemesterId); hideModal(semesterModal); activeSemesterId=null;
});

function openCourseModal(sid,cid){
  activeSemesterId = sid; activeCourseId = cid;
  const sem = state.semesters.find(s=>s.id===sid); if(!sem) return;
  const course = sem.courses.find(c=>c.id===cid); if(!course) return;
  modalCourseTitle.value = course.title || "";
  modalCourseCredits.value = course.credits||"";
  modalCourseMid.value = course.mid||"";
  modalCourseSessional.value = course.sessional||"";
  modalCourseFinal.value = course.final||"";
  totalMarksDisplay.textContent = (Number(course.mid)||0)+(Number(course.sessional)||0)+(Number(course.final)||0);
  showModal(courseModal);
}
modalSaveCourse?.addEventListener("click", ()=>{
  if(!activeSemesterId||!activeCourseId) return;
  const sem=state.semesters.find(s=>s.id===activeSemesterId); if(!sem) return;
  const course = sem.courses.find(c=>c.id===activeCourseId); if(!course) return;
  course.title=modalCourseTitle.value.trim()||"Untitled";
  course.credits=Number(modalCourseCredits.value)||0;
  course.mid=Number(modalCourseMid.value)||0;
  course.sessional=Number(modalCourseSessional.value)||0;
  course.final=Number(modalCourseFinal.value)||0;
  course.total = course.mid+course.sessional+course.final;
  hideModal(courseModal); activeSemesterId=null; activeCourseId=null; render();
});
modalCancelCourse?.addEventListener("click", ()=>{ hideModal(courseModal); activeSemesterId=null; activeCourseId=null; });
modalDeleteCourse?.addEventListener("click", () => {
    if (!activeSemesterId || !activeCourseId) return;
    const sem = state.semesters.find(s => s.id === activeSemesterId);
    if (!sem) return;
    if (confirm("Delete this course?")) {
        sem.courses = sem.courses.filter(c => c.id !== activeCourseId);
        hideModal(courseModal);
        activeSemesterId = null;
        activeCourseId = null;
        render();
    }
});

addSemesterBtn?.addEventListener("click", ()=>{
  const name=(newSemesterName.value||"").trim()||`Semester ${state.semesters.length+1}`;
  state.semesters.push({id:uid(),name,courses:[]});
  newSemesterName.value="";
  render();
});

function render() {
    if (!semestersEl) return;
    semestersEl.innerHTML = "";

    state.semesters.forEach(sem => {
        const semNode = document.createElement("div");
        semNode.className = "sem";
        semNode.dataset.sid = sem.id;

        const head = document.createElement("div");
        head.className = "sem-head";
        head.innerHTML = `
          <div class="sem-left">
            <div class="sem-title">${escapeHtml(sem.name)}</div>
            <div class="sem-meta">Courses: <span class="muted">${sem.courses.length}</span></div>
          </div>
          <div class="sem-actions">
            <div class="badge">SGPA: <strong id="gpa-${sem.id}">0.00</strong></div>
            <button class="btn subtle edit-sem" data-sid="${sem.id}">Edit</button>
            <button class="btn subtle export-sem" data-sid="${sem.id}">Export PDF</button>
            <button class="btn danger del-sem" data-sid="${sem.id}">Delete</button>
          </div>`;
        semNode.appendChild(head);

        const coursesWrap = document.createElement("div");
        coursesWrap.className = "courses";

        const headerRow = document.createElement("div");
        headerRow.className = "course";
        headerRow.style.fontWeight = "700";
        headerRow.innerHTML = "<div>Course</div><div>Marks</div><div>Credit Hour</div><div>Grade</div><div>GP</div><div>Total</div><div></div>";
        coursesWrap.appendChild(headerRow);

        sem.courses.forEach(c => {
            const totalMarks = (Number(c.mid) || 0) + (Number(c.sessional) || 0) + (Number(c.final) || 0);
            c.total = totalMarks;
            const { grade, point } = marksToGrade(totalMarks);

            const row = document.createElement("div");
            row.className = "course";
            row.dataset.cid = c.id;
            row.innerHTML = `
                <input type="text" class="course-title" value="${escapeHtml(c.title)}" />
                <input type="number" class="course-marks" value="${totalMarks}" disabled />
                <input type="number" class="course-credits" value="${c.credits||""}" />
                <div class="muted course-grade">${grade}</div>
                <div class="muted course-point">${point.toFixed(2)}</div>
                <div class="muted course-total">${totalMarks}</div>
                <div style="display:flex;gap:6px;justify-content:flex-end">
                    <button class="btn subtle open-course-modal" data-sid="${sem.id}" data-cid="${c.id}">Edit</button>
                </div>`;
            coursesWrap.appendChild(row);
        });

        const addRow = document.createElement("div");
        addRow.className = "course";
        addRow.innerHTML = `
            <input type="text" class="course-title new" placeholder="Course Title" />
            <input type="number" class="course-marks new" placeholder="Marks" disabled />
            <input type="number" class="course-credits new" placeholder="Credit Hour" />
            <div class="muted">Grade</div><div class="muted">GP</div><div class="muted">Total</div>
            <div style="display:flex;gap:6px;justify-content:flex-end">
                <button class="btn primary add-course" data-sid="${sem.id}">Add</button>
            </div>`;
        coursesWrap.appendChild(addRow);

        semNode.appendChild(coursesWrap);
        semestersEl.appendChild(semNode);
    });

    attachHandlers();
    updateGPAandCGPA();
    save();
}

function attachHandlers(){
  document.querySelectorAll(".edit-sem").forEach(btn=>btn.onclick=()=>openSemesterModal(btn.dataset.sid));
  document.querySelectorAll(".del-sem").forEach(btn=>btn.onclick=()=>{ if(confirm("Delete this semester?")){ state.semesters=state.semesters.filter(s=>s.id!==btn.dataset.sid); render(); }});
  document.querySelectorAll(".export-sem").forEach(btn=>btn.onclick=()=>exportSemesterPDF(btn.dataset.sid));

  document.querySelectorAll(".add-course").forEach(btn=>{
    btn.onclick=()=>{
      const sid=btn.dataset.sid; 
      const sem=state.semesters.find(s=>s.id===sid); if(!sem) return;
      const row=btn.closest(".course"); 
      const title=row.querySelector(".course-title.new").value.trim();
      const credits=row.querySelector(".course-credits.new").value.trim();
      if(!title && !credits) {
        const newC = {id:uid(), title:"", credits:0, mid:0, sessional:0, final:0, total:0};
        sem.courses.push(newC);
        render();
        openCourseModal(sid,newC.id);
      } else {
        const newC = {id:uid(), title:title||"Untitled", credits:Number(credits)||0, mid:0, sessional:0, final:0, total:0};
        sem.courses.push(newC);
        render();
      }
    };
  });

  document.querySelectorAll(".open-course-modal").forEach(btn=>btn.onclick=()=>openCourseModal(btn.dataset.sid,btn.dataset.cid));

  document.querySelectorAll(".course-credits, .course-title").forEach(inp=>{
    inp.oninput=(e)=>{
      const row=e.target.closest(".course"); const cid=row.dataset.cid; if(!cid) return;
      const sid=row.closest(".sem").dataset.sid; const sem=state.semesters.find(s=>s.id===sid); if(!sem) return;
      const course=sem.courses.find(c=>c.id===cid); if(!course) return;
      course.title=row.querySelector(".course-title").value;
      course.credits=Number(row.querySelector(".course-credits").value)||0;
      course.total=(Number(course.mid)||0)+(Number(course.sessional)||0)+(Number(course.final)||0);
      const {grade,point}=marksToGrade(course.total);
      row.querySelector(".course-grade").textContent=grade;
      row.querySelector(".course-point").textContent=point.toFixed(2);
      row.querySelector(".course-total").textContent=course.total;
      updateGPAandCGPA(); save();
    };
  });
}
function semesterCalc(sem){
  let creditsSum=0, pointsSum=0;
  (sem.courses||[]).forEach(c=>{
    const credits=Number(c.credits)||0; const {point,grade}=marksToGrade(c.total||0);
    c.grade=grade; c.point=point; creditsSum+=credits; pointsSum+=credits*point;
  });
  return {gpa: creditsSum?+(pointsSum/creditsSum).toFixed(2):0, credits: creditsSum};
}
function computeCGPA(){
  let totalCredits=0,totalPoints=0;
  state.semesters.forEach(s=>{ s.courses.forEach(c=>{ const credits=Number(c.credits)||0; const {point}=marksToGrade(c.total||0); totalCredits+=credits; totalPoints+=credits*point; }); });
  return {cgpa: totalCredits?+(totalPoints/totalCredits).toFixed(2):0, totalCredits};
}
function updateGPAandCGPA(){
  state.semesters.forEach(s=>{ const res=semesterCalc(s); const g=document.getElementById(`gpa-${s.id}`); if(g) g.textContent=res.gpa.toFixed(2); });
  const cg=computeCGPA(); if(cgpaVal) cgpaVal.textContent=cg.cgpa.toFixed(2); if(totalCreditsEl) totalCreditsEl.textContent=`Total Credits: ${cg.totalCredits}`;
}

document.getElementById("clearAllBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all semesters?")) {
        localStorage.removeItem(STORAGE_KEY); 
        semestersEl.innerHTML = ""; 
        cgpaVal.textContent = "0.00"; 
        totalCreditsEl.textContent = "0"; 
    }
});

function exportSemesterPDF(sid) {
    const sem = state.semesters.find(s => s.id === sid);
    if (!sem) { alert("Semester not found"); return; }

    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = "'Poppins', sans-serif";
    wrapper.style.backgroundColor = "#0b0d1a"; 
    wrapper.style.color = "#ffffff"; 
    wrapper.style.padding = "20px";
    wrapper.style.borderRadius = "12px";

    wrapper.innerHTML = `
        <h1 style="text-align:center; font-size:26px; margin-bottom:15px; color:#6efbff;">
          ${escapeHtml(sem.name)}
        </h1>
    `;

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "15px";
    table.innerHTML = `
        <tr style="background:#2c2c44; color:#ffffff; font-weight:600;">
            <th style="padding:10px;">Course</th>
            <th style="padding:10px;">Marks</th>
            <th style="padding:10px;">Credit</th>
            <th style="padding:10px;">Grade</th>
            <th style="padding:10px;">GP</th>
            <th style="padding:10px;">Total</th>
        </tr>
    `;

    let totalCredits = 0, totalPoints = 0;
    sem.courses.forEach((c, idx) => {
        const totalMarks = (Number(c.mid)||0)+(Number(c.sessional)||0)+(Number(c.final)||0);
        const { grade, point } = marksToGrade(totalMarks);
        totalCredits += Number(c.credits)||0;
        totalPoints += (Number(c.credits)||0) * point;

        const tr = document.createElement("tr");
        tr.style.background = idx % 2 === 0 ? "#1c1c2b" : "#232336";
        tr.innerHTML = `
            <td style="padding:8px; color:#fffbf0;">${escapeHtml(c.title||'')}</td>
            <td style="padding:8px; text-align:center;">${totalMarks}</td>
            <td style="padding:8px; text-align:center;">${c.credits||0}</td>
            <td style="padding:8px; text-align:center; color:#ff61a6; font-weight:600;">${grade}</td>
            <td style="padding:8px; text-align:center; color:#6efbff;">${point.toFixed(2)}</td>
            <td style="padding:8px; text-align:center;">${totalMarks}</td>
        `;
        table.appendChild(tr);
    });

    wrapper.appendChild(table);

    const sgpa = totalCredits ? +(totalPoints/totalCredits).toFixed(2) : 0;
    const summary = document.createElement("div");
    summary.style.marginTop = "20px";
    summary.style.padding = "12px";
    summary.style.borderRadius = "10px";
    summary.style.background = "linear-gradient(90deg,#ff61a6,#6efbff)";
    summary.style.color = "#0b0d1a";
    summary.style.textAlign = "center";
    summary.style.fontWeight = "700";
    summary.textContent = `SGPA: ${sgpa} | Total Credits: ${totalCredits}`;
    wrapper.appendChild(summary);

    html2pdf()
      .set({
          margin: 10,
          filename: `${sem.name.replace(/\s+/g,'_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, backgroundColor: "#0b0d1a" },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(wrapper)
      .save();
}

function exportAllSemestersPDF() {
    if (!state.semesters.length) { alert("No semesters to export"); return; }

    const wrapper = document.createElement("div");
    wrapper.style.fontFamily = "'Poppins', sans-serif";
    wrapper.style.backgroundColor = "#0b0d1a";
    wrapper.style.color = "#ffffff";
    wrapper.style.padding = "20px";
    wrapper.style.borderRadius = "12px";

    wrapper.innerHTML = `
      <h1 style="text-align:center; font-size:28px; color:#6efbff; margin-bottom:20px;">
        All Semesters Transcript
      </h1>
    `;

    let overallCredits = 0, overallPoints = 0;

    state.semesters.forEach(sem => {
        const semDiv = document.createElement("div");
        semDiv.style.marginBottom = "25px";
        semDiv.innerHTML = `<h2 style="color:#ff61a6; margin-bottom:10px;">${escapeHtml(sem.name)}</h2>`;

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginBottom = "10px";
        table.innerHTML = `
            <tr style="background:#2c2c44; color:#ffffff; font-weight:600;">
                <th style="padding:10px;">Course</th>
                <th style="padding:10px;">Marks</th>
                <th style="padding:10px;">Credit</th>
                <th style="padding:10px;">Grade</th>
                <th style="padding:10px;">GP</th>
                <th style="padding:10px;">Total</th>
            </tr>
        `;

        let totalCredits = 0, totalPoints = 0;
        sem.courses.forEach((c, idx) => {
            const totalMarks = (Number(c.mid)||0)+(Number(c.sessional)||0)+(Number(c.final)||0);
            const { grade, point } = marksToGrade(totalMarks);
            totalCredits += Number(c.credits)||0;
            totalPoints += (Number(c.credits)||0) * point;
            overallCredits += Number(c.credits)||0;
            overallPoints += (Number(c.credits)||0) * point;

            const tr = document.createElement("tr");
            tr.style.background = idx % 2 === 0 ? "#1c1c2b" : "#232336";
            tr.innerHTML = `
                <td style="padding:8px; color:#fffbf0;">${escapeHtml(c.title||'')}</td>
                <td style="padding:8px; text-align:center;">${totalMarks}</td>
                <td style="padding:8px; text-align:center;">${c.credits||0}</td>
                <td style="padding:8px; text-align:center; color:#ff61a6; font-weight:600;">${grade}</td>
                <td style="padding:8px; text-align:center; color:#6efbff;">${point.toFixed(2)}</td>
                <td style="padding:8px; text-align:center;">${totalMarks}</td>
            `;
            table.appendChild(tr);
        });

        semDiv.appendChild(table);

        const sgpa = totalCredits ? +(totalPoints/totalCredits).toFixed(2) : 0;
        const summary = document.createElement("div");
        summary.style.marginBottom = "15px";
        summary.style.padding = "10px";
        summary.style.borderRadius = "10px";
        summary.style.background = "linear-gradient(90deg,#ff61a6,#6efbff)";
        summary.style.color = "#0b0d1a";
        summary.style.textAlign = "center";
        summary.style.fontWeight = "700";
        summary.textContent = `SGPA: ${sgpa} | Total Credits: ${totalCredits}`;
        semDiv.appendChild(summary);

        wrapper.appendChild(semDiv);
    });

    const overallCGPA = overallCredits ? +(overallPoints/overallCredits).toFixed(2) : 0;
    const cgpaDiv = document.createElement("div");
    cgpaDiv.style.marginTop = "20px";
    cgpaDiv.style.padding = "12px";
    cgpaDiv.style.borderRadius = "12px";
    cgpaDiv.style.background = "linear-gradient(90deg,#6efbff,#ff61a6)";
    cgpaDiv.style.color = "#0b0d1a";
    cgpaDiv.style.textAlign = "center";
    cgpaDiv.style.fontWeight = "800";
    cgpaDiv.textContent = `Overall CGPA: ${overallCGPA} | Total Credits: ${overallCredits}`;
    wrapper.appendChild(cgpaDiv);
    html2pdf()
      .set({
          margin: 10,
          filename: `All_Semesters_Transcript.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, backgroundColor: "#0b0d1a" },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(wrapper)
      .save();
}

load(); initTheme(); render();
exportAllBtn?.addEventListener("click", exportAllSemestersPDF); 