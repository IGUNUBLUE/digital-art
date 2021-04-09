/*eslint-disable*/

import React,{useState} from "react";
import {useDispatch} from "react-redux";
//import {addCategory} from "../../../Redux/Actions/index";


function CategoryForm(){
   const dispatch = useDispatch();
   const [input,setInput]= useState("");


   function handleChange(e) {
    setInput(e.target.value);
  };

  function handleSubmit(e){
    e.preventDefault();
    dispatch(addCategory(input))
  }

  return(
      <div className="form_container">
          <h3>Add a new Category for your Galery!</h3>
              <form className="input_form" onSubmit={handleSubmit}>
                   <label htmlFor="name">
                      <input 
                      required
                      placeholder="New Category"
                      type="text"
                      name="name"
                      value={input}
                      onChange={handleChange}
                      />
                  </label>
               <button type="submit">Add</button>
          </form>
      </div>
  )


};

export default CategoryForm; 