const Course = require('../models/CourseModel');
const Test = require('../models/CourseSuggestion');

// ✅ Gợi ý khóa học theo tỉ lệ trả lời đúng
const getSuggestedCourses = async (answers) => {
  const allTests = await Test.find();
  const allQuestions = allTests.flatMap(test => test.questions);

  let correctCount = 0;

  for (const ans of answers) {
    const question = allQuestions.find(q => q.questionId === ans.questionId);
    if (question) {
      const correctOption = question.options[question.correctAnswer.charCodeAt(0) - 65]; // "C" -> 2 -> "option at index 2"
      if (ans.answer === correctOption) {
        correctCount++;
      }
    }

  }

  const totalQuestions = answers.length;
  const accuracy = totalQuestions === 0 ? 0 : (correctCount / totalQuestions) * 100;

  // ✅ Gợi ý cấp độ dựa vào phần trăm đúng
  let levelTag = "";
  let matchedType = "";

  if (accuracy < 40) {
    levelTag = "basic";
    matchedType = "Cơ bản";
  } else if (accuracy < 60) {
    levelTag = "intermediate1";
    matchedType = "Trung cấp 1";
  } else if (accuracy < 75) {
    levelTag = "intermediate2";
    matchedType = "Trung cấp 2";
  } else if (accuracy < 90) {
    levelTag = "advanced1";
    matchedType = "Nâng cao 1";
  } else {
    levelTag = "advanced2";
    matchedType = "Nâng cao 2";
  }

  // ✅ Tìm khóa học theo code (chuyển về không dấu, viết liền)
  const recommendedCourses = await Course.find({ type: matchedType });

  return {
    correctCount,
    totalQuestions,
    accuracy: accuracy.toFixed(2) + "%",
    level: levelTag,
    type: matchedType,
    courses: recommendedCourses
  };
};

// ✅ Tạo bài test mới
const createTest = async (testData) => {
  try {
    const newTest = new Test(testData);
    await newTest.save();
    return newTest;
  } catch (error) {
    throw new Error('Error creating test: ' + error.message);
  }
};

// ✅ Lấy tất cả bài test
const getAllTests = async () => {
  try {
    const tests = await Test.find({});
    return tests;
  } catch (error) {
    throw new Error('Error fetching tests: ' + error.message);
  }
};

const updateTest = async (testId, updateData) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(testId, updateData, { new: true });
    if (!updatedTest) throw new Error('Test not found');
    return updatedTest;
  } catch (error) {
    throw new Error('Error updating test: ' + error.message);
  }
};

// ✅ Xóa bài test
const deleteTest = async (testId) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(testId);
    if (!deletedTest) throw new Error('Test not found');
    return deletedTest;
  } catch (error) {
    throw new Error('Error deleting test: ' + error.message);
  }
};

module.exports = {
  createTest,
  getAllTests,
  getSuggestedCourses,
  updateTest,
  deleteTest
};
