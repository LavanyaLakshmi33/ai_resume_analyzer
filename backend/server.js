const skills = require("./skills");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }

});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("resume"), async (req, res) => {

  try {

    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text.toLowerCase();

    const jobDescription = req.body.jobDescription.toLowerCase();

    const matchedSkills = [];

    const missingSkills = [];

    skills.forEach((skill) => {

      const inResume = resumeText.includes(skill);

      const inJD = jobDescription.includes(skill);

      if (inJD && inResume) {
        matchedSkills.push(skill);
      }

      else if (inJD && !inResume) {
        missingSkills.push(skill);
      }

    });

    const atsScore =
      (matchedSkills.length /
        (matchedSkills.length + missingSkills.length)) * 100;
const suggestions = [];

if (missingSkills.length > 0) {

  suggestions.push(
    `Add missing skills like ${missingSkills.slice(0,3).join(", ")}`
  );

}

if (atsScore < 50) {

  suggestions.push(
    "Include more relevant technical skills and projects"
  );

}

if (!resumeText.includes("project")) {

  suggestions.push(
    "Mention technical projects to strengthen your resume"
  );

}

if (!resumeText.includes("%")) {

  suggestions.push(
    "Add measurable achievements using percentages or numbers"
  );

}
    res.json({

      matchedSkills,

      missingSkills,

      atsScore: atsScore.toFixed(2),
      suggestions

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Error analyzing resume"
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});