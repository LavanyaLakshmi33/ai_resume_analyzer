import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);

  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    formData.append("jobDescription", jobDescription);

    try {

      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.log(error);

      alert("Analysis failed");

    }
  };

  return (

    <div className="app">

      <div className="container">

        <h1>AI Resume Analyzer</h1>

        <p className="subtitle">
          Analyze resumes against job descriptions using ATS-style matching
        </p>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <textarea
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button onClick={handleUpload}>
          Analyze Resume
        </button>

        {result && (

          <div className="result-container">

            <div className="score-card">

              <h2>ATS Score</h2>

              <p className="score">
                {result.atsScore}%
              </p>

            </div>

            <div className="skills-section">

              <div className="skills-card">

                <h3>Matched Skills</h3>

                <div className="skills-list">

                  {result.matchedSkills.map((skill, index) => (
                    <span className="matched" key={index}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <div className="skills-card">

                <h3>Missing Skills</h3>

                <div className="skills-list">

                  {result.missingSkills.map((skill, index) => (
                    <span className="missing" key={index}>
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

            </div>

            <div className="skills-card">

              <h3>Suggestions</h3>

              <ul className="suggestions-list">

                {result.suggestions.map((item, index) => (

                  <li key={index}>{item}</li>

                ))}

              </ul>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default App;