import './CourseCard.css'

const TAG_STYLES = {
  exam: 'tag-exam',
  hw: 'tag-hw',
  quiz: 'tag-quiz',
  project: 'tag-project',
}

function SkeletonCard() {
  return (
    <div className="course-card loading">
      <div className="card-top">
        <div className="skeleton card-dot" style={{ width: 10, height: 10, borderRadius: '50%' }} />
        <div className="skeleton skeleton-title" />
      </div>
      <div className="skeleton skeleton-sub" />
      <div className="skeleton skeleton-row" />
      <div className="skeleton skeleton-row-short" />
      <div className="card-divider" />
      <div className="skeleton-tags">
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
      </div>
      <div className="loading-label">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
        Extracting course info
      </div>
    </div>
  )
}

export default function CourseCard({ course, onClick }) {
  if (course.loading) return <SkeletonCard />

  return (
    <div className="course-card" onClick={onClick}>
      <div className="card-top">
        <div className="card-dot" style={{ background: course.color }} />
        <div className="card-name">{course.courseName}</div>
      </div>

      <div className="card-code">
        {course.courseCode} · {course.instructor}
      </div>

      {course.officeHours?.[0] && (
        <div className="card-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {course.officeHours[0]}
        </div>
      )}

      {course.instructorEmail && (
        <div className="card-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c8a800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {course.instructorEmail}
        </div>
      )}

      {course.upcomingAssignments?.length > 0 && (
        <>
          <div className="card-divider" />
          <div className="card-tags">
            {course.upcomingAssignments.slice(0, 3).map((a, i) => (
              <span key={i} className={`upcoming-tag ${TAG_STYLES[a.type] || 'tag-hw'}`}>
                {a.name} {a.due}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}