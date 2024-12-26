import { useState } from "react";

export default function App() {
  let arr = [
    { id: 1, name: "1" },
    { id: 2, name: "1" },
    { id: 3, name: "2" },
    { id: 4, name: "2" },
    { id: 5, name: "3" },
    { id: 6, name: "3" },
  ];

  const [items, setItems] = useState(arr);

  const [value, setValue] = useState("");

  function onChange(e){
    setValue(e.target.value)
  }

  function add(){
    setItems((prevItems)=>{
      return[...prevItems, {id : prevItems.length + 1, name : value}]
    })
  }

  function remove(id){
    let arr =  items.filter((item) => item.id !== id)
    setItems(arr);
  }
 
  return(
    <>
    <h1>items</h1>
      {
        items.map((item, index)=>
          <>
                    <li key={index}>{item.id}-{item.name} </li>
                    <button onClick={()=>remove(item.id)}>remove item</button>

           

          </>


        )
      }

      <input type="text" placeholder="add item" onChange={onChange} value={value}/><br></br>

      <br /><button onClick={add}>add Item</button><br /><br />
    </>
  )
}
