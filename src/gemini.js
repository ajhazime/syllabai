import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export async function extractSyllabus(file) {
  const base64 = await toBase64(file)
  const mimeType = file.type

const prompt = `You are extracting structured information from a course syllabus. Return ONLY valid JSON, no markdown, no explanation, no code blocks.

Return exactly this shape:
{
  "courseName": "Full course name",
  "courseCode": "e.g. CS 101",
  "instructor": "Professor name",
  "instructorEmail": "email or null",
  "officeHours": ["list of office hours strings e.g. Mon 2-4pm Room 201"],
  "lectureTime": "e.g. TTh 9:30-10:50am TTH 201 or null",
  "discussionSection": "e.g. Fri 10-11:50am SGM 101 or null",
  "gradingScale": [{"grade":"A","range":"90-100%"}],
  "assignmentWeights": [{"name":"Homework","weight":"24%","count":9}],
  "examDates": [{"name":"Midterm","date":"Oct 15","time":"10am","location":"Room 201"}],
  "upcomingAssignments": [{"name":"HW1","due":"Sept 10","type":"hw"}]
}

For assignmentWeights, "count" is the total number of individual assignments of that type found in the syllabus (e.g. if there are 9 problem sets, count is 9). Calculate this from the schedule or any assignment list in the syllabus.
For upcomingAssignments, type must be one of: hw, exam, project, quiz.
Extract as much as you can. If something is missing use null or empty array.`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64,
            }
          },
          { text: prompt }
        ]
      }
    ]
  })

  const text = response.text || ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result.split(',')[1])
    reader.onerror = () => rej(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}