const courseService = require('../services/CourseSuggestion');

const suggestCourse = async (req, res) => {
  try {
    const { answers } = req.body;
    
    const suggestedCourses = await courseService.getSuggestedCourses(answers);

    res.json(suggestedCourses);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra", error: error.message });
  }
};


const createTest = async (req, res) => {
  try {
    const testData = req.body; 
    const newTest = await courseService.createTest(testData); 
    return res.status(201).json(newTest);  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};

const getAllTests = async (req, res) => {
  try {
    const { courseType } = req.params; 
    const tests = await courseService.getAllTests(courseType); 
    return res.status(200).json(tests); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTest = await courseService.updateTest(id, updateData);
    return res.status(200).json(updatedTest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating test', error: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTest = await courseService.deleteTest(id);
    return res.status(200).json({ message: 'Test deleted', deletedTest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting test', error: error.message });
  }
};


module.exports = {
  createTest,
  getAllTests,
  suggestCourse,
  updateTest,
  deleteTest
};


