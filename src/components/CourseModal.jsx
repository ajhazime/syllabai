import './CourseModal.css'

const TAG_STYLES = {
  exam: 'tag-exam',
  hw: 'tag-hw',
  quiz: 'tag-quiz',
  project: 'tag-project',
}

function calcIndividualWeight(totalWeight, count) {
  const pct = parseFloat(totalWeight) || 0
  const n = count || 1
  return (pct / n).toFixed(1)
}

export default function CourseModal({ course, onClose }) {
  if (!course) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div className="header-left">
            <div className="header-dot" style={{ background: course.color }} />
            <div>
              <div className="header-title">{course.courseName}</div>
              <div className="header-code">{course.courseCode} · {course.instructor}</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* Instructor */}
          <div className="section">
            <div className="section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Instructor
            </div>
            <div className="info-row"><strong>{course.instructor}</strong></div>
            {course.instructorEmail && (
              <div className="info-row email">{course.instructorEmail}</div>
            )}
            {course.officeHours?.map((oh, i) => (
              <div key={i} className="info-row">{oh}</div>
            ))}
            {course.lectureTime && (
              <div className="info-row">
                <strong style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lecture</strong>
                <br />{course.lectureTime}
              </div>
            )}
            {course.discussionSection && (
              <div className="info-row">
                <strong style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Discussion</strong>
                <br />{course.discussionSection}
              </div>
            )}
          </div>

          {/* Grading scale */}
          {course.gradingScale?.length > 0 && (
            <div className="section">
              <div className="section-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                Grading scale
              </div>
              {course.gradingScale.map((g, i) => (
                <div key={i} className="scale-row">
                  <span className="scale-grade">{g.grade}</span>
                  <span className="scale-range">{g.range}</span>
                </div>
              ))}
            </div>
          )}

          {/* Assignment weights */}
          {course.assignmentWeights?.length > 0 && (
            <div className="section full">
              <div className="section-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Assignment weights
              </div>
              {course.assignmentWeights.map((w, i) => {
                const pct = parseFloat(w.weight) || 0
                const count = w.count || 1
                const indivWeight = calcIndividualWeight(w.weight, count)

                return (
                  <div key={i} className="grade-row">
                    <div className="grade-left">
                      <span className="grade-label">{w.name}</span>
                      <span className="grade-count">{count} total · {indivWeight}% each</span>
                    </div>
                    <div className="grade-bar-bg">
                      <div
                        className="grade-bar-fill"
                        style={{ width: `${Math.min(pct, 100)}%`, background: course.color }}
                      />
                    </div>
                    <span className="grade-pct">{w.weight}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Exams & deadlines */}
          {(course.examDates?.length > 0 || course.upcomingAssignments?.length > 0) && (
            <div className="section full">
              <div className="section-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Exams & deadlines
              </div>
              {course.examDates?.map((e, i) => (
                <div key={`exam-${i}`} className="exam-item">
                  <div>
                    <div className="exam-name">{e.name}</div>
                    <div className="exam-meta">
                      {e.date}{e.time ? ` · ${e.time}` : ''}{e.location ? ` · ${e.location}` : ''}
                    </div>
                  </div>
                  <span className="exam-badge tag-exam">Exam</span>
                </div>
              ))}
              {course.upcomingAssignments?.map((a, i) => (
                <div key={`assign-${i}`} className="exam-item">
                  <div>
                    <div className="exam-name">{a.name}</div>
                    <div className="exam-meta">Due {a.due}</div>
                  </div>
                  <span className={`exam-badge ${TAG_STYLES[a.type] || 'tag-hw'}`}>
                    {a.type === 'hw' ? 'HW'
                      : a.type === 'quiz' ? 'Quiz'
                      : a.type === 'project' ? 'Project'
                      : 'Exam'}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      
    </div>
  )
}