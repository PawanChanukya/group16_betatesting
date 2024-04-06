

//   const f1etchCoursesList=async()=>{
//     try{
//       setStatus("LOADING");
//       const res = await fetch(`/getUserCourseById`,{
//         method:"GET",
//         headers:{
//           Accept:"application/json",
//           "Content-Type":"application/json",
//         },
//         credentials:"include",
//       });
//       if(res.status===200){
//         const data = await res.json();
//         const allCourses=await data.allCourses;
//         console.log(allCourses)
//         setCourses({allCourse:allCourses, filteredCourse:allCourses});
//         setStatus("SUCCESS");
//       }else if(res.status===401){
//         toast.error("Unauthorized ! Please Login !")
//         navigate("/login");
//       }
//       else  throw new Error(res.error);
//     }catch(err){
//       toast.error("something went wrong! Unable to load the course list !");
//       setStatus("ERROR");
//       console.log(err);
//     }
//   }
 
//   useEffect(()=>{
//     callCoursePage().then(()=>fetchCoursesList()).catch((error)=>console.log(error));
//   },[]);