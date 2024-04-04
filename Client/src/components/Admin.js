import React, { useState, useEffect } from 'react';
import './Admin.css';

const initialCourseData = [
  {
    id: 1,
    branch: 'CSE',
    courseId: 'CS253',
    courseName: 'SOFTWARE ENGINEERING AND DEVELOPMENT',
    credits: 12,
    time: 'T (RM101) W (RM101) F (RM101) 10:00-11:00',
    instructor: 'Dr. Indranil Saha',
    status: 'Active',
  },
  {
    id: 2,
    branch: 'CSE',
    courseId: 'ESO207',
    courseName: 'DATA STRUCTURES AND ALGORITHMS',
    credits: 12,
    time: 'M (L07) W (L07) Th (L07) 12:00-13:00',
    instructor: 'Dr. Nitin Saxena',
    status: 'Active',
  },
  {
    id: 3,
    branch: 'EE',
    courseId: 'EE698R',
    courseName: 'ADVANCED TOPICS IN MACHINE LEARNING',
    credits: 9,
    time: 'T (L16) Th (L16) 17:15-18:30',
    instructor: 'Dr. Aparna Datt',
    status: 'Active',
  },
  {
    id: 4,
    branch: 'BSBE',
    courseId: 'BSE322A',
    courseName: 'BIOINFORMATICS & COMPUTATIONAL BIOLOGY',
    credits: 10,
    time: 'M (L01) Th (L01) 12:00-13:15',
    instructor: 'Dr. Nitin Gupta',
    status: 'Active',
  },
  // Add more courses here
];

const App = () => {
  const [formData, setFormData] = useState({
    branch: '',
    courseId: '',
    courseName: '',
    credits: '',
    time: '',
    instructor: '',
    status: 'Active', // Default status
  });
  const [courseData, setCourseData] = useState(initialCourseData);
  const [selectedBranch, setSelectedBranch] = useState(''); // Default branch
  const [searchText, setSearchText] = useState('');
  const [editingId, setEditingId] = useState(null);
  // const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    // Function to filter course data based on search text
    const searchTextLower = searchText.toLowerCase();
    const filteredCourses = courseData.filter((course) =>
      course.courseName.toLowerCase().includes(searchTextLower)
    );
    setCourseData(filteredCourses);
  }, [searchText, courseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedCourses = courseData.map((course) =>
        course.id === editingId ? formData : course
      );
      setCourseData(updatedCourses);
    } else {
      setCourseData([...courseData, { ...formData, id: courseData.length + 1 }]);
    }
    // Clear the form fields
    setFormData({
      ...formData,
      branch: '',
      courseId: '',
      courseName: '',
      credits: '',
      time: '',
      instructor: '',
      status: '',
    });
    setEditingId(null);
};


  const handleEdit = (id) => {
    const courseToEdit = courseData.find((course) => course.id === id);
    setFormData(courseToEdit);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    const updatedCourses = courseData.filter((course) => course.id !== id);
    setCourseData(updatedCourses);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
    const searchTextLower = value.toLowerCase();
  
    // If the search input is empty, display all courses
    if (value.trim() === '') {
      setCourseData(initialCourseData);
      return;
    }
  
    // Filter courses based on course name
    const filteredCourses = courseData.filter((course) =>
      course.courseName.toLowerCase().includes(searchTextLower)
    );
    setCourseData(filteredCourses);
  };

  const filteredCourses = courseData.filter((course) => {
    const name = course.courseName.toLowerCase();
    const search = searchText.toLowerCase();
    return name.includes(search);
  });

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>
      <div className="branch-select">
        <label htmlFor="branch">Select Branch:</label>
        <select id="branch" name="branch" value={selectedBranch} onChange={handleBranchChange}>
          <option value="">All</option>
          <option value="AE">AE</option>
          <option value="BSBE">BSBE</option>
          <option value="CE">CE</option>
          <option value="CSE">CSE</option>
          <option value="EE">EE</option>
        </select>
      </div>
      <div className="search-course">
        <label htmlFor="search">Search Course by Name:</label>
        <input type="text" id="search" name="search" value={searchText} onChange={handleSearchChange} />
      </div>
      <br></br>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Branch</th>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Time slot</th>
            <th>Instructor</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
            <tr key={course.id}>
              <td>{index + 1}</td>
              <td>{course.branch}</td>
              <td>{course.courseId}</td>
              <td>{course.courseName}</td>
              <td>{course.credits}</td>
              <td>{course.time}</td>
              <td>{course.instructor}</td>
              <td>{course.status}</td>
              <td>
                <button className="update-button" onClick={() => handleEdit(course.id)}>Edit</button>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(course.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Add/Update Course</h2>
          <div className="form-group">
            <label htmlFor="branch">Branch:</label>
            <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
              <option value="">Select Branch</option>
              <option value="AE">AE</option>
              <option value="BSBE">BSBE</option>
              <option value="CE">CE</option>
              <option value="CSE">CSE</option>
              <option value="EE">EE</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="courseId">Course ID:</label>
            <input type="text" id="courseId" name="courseId" value={formData.courseId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="courseName">Course Name:</label>
            <input type="text" id="courseName" name="courseName" value={formData.courseName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="credits">Credits:</label>
            <input type="number" id="credits" name="credits" value={formData.credits} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input type="text" id="time" name="time" value={formData.time} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="instructor">Instructor:</label>
            <input type="text" id="instructor" name="instructor" value={formData.instructor} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button className="save-button"type="submit">Save</button>
        </form>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Add Announcement</h2>
          <div className="form-group">
            <label htmlFor="announcementHeading">Announcement Heading:</label>
            <input type="text" id="announcementHeading" name="announcementHeading" value={formData.announcementHeading} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="announcementInfo">Announcement Information:</label>
            <textarea
              id="announcementInfo"
              name="announcementInfo"
              value={formData.announcementInfo}
              onChange={handleChange}
              required
              className="input-text" // Apply the same CSS class as input elements
            />
          </div>
          <button className="save-button" type="submit">Save Announcement</button>
        </form>
      </div>
    </div>
  );
};

export default App;