import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://protecttext.onrender.com";


export const addnewTab = createAsyncThunk("addnewtab", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/addnewtab/${userId}`);
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message); 
  }
});


export const deleteTab = createAsyncThunk("deleteTab", async ({tabId, ownerId}, { rejectWithValue }) => {
  try {
    
    const response = await axios.delete(`/deleteTab/${tabId}/${ownerId}`);
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message); 
  }
});


export const saveTabData = createAsyncThunk("saveTabData", async ({ tabId, ownerId }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); 
      const selectedTabData = state.tabs.selectedTab;

      const response = await axios.put(`/saveTabData/${tabId}/${ownerId}`, selectedTabData);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const tabSlice = createSlice({
    name: 'tabs',
    initialState: {

       username : "",
       tabsData :[],
       selectedTab : {id :"", title:"", data:"", owner : ""},
       isDataSaved : false,
       isLoggedIn : false,
       userDetails : {username : "", password : ""},
       roomname : "",
       collaboration : "yes",
       groupType : "Public",
       isAdmin : false,
       loadTabs : false,
       fetchError : "",
    },
    reducers: {

      setUsername : (state, action)=>{
        state.username = action.payload;
      },

      addNewTab :(state, action) =>{
        state.isDataSaved ? 
        alert("save data first") : 
        state.tabsData.push({id : uuidv4(), title: `Empty Tab`, data : ""});
          
      },

      //synchronous
      selectedTab :(state, action)=>{
          state.isDataSaved ? 
          alert("save data first") : 
          state.selectedTab = action.payload;
      },

      //asynchronous
      saveData: (state, action) => {
        let title = action.payload.title === "Empty Tab"? prompt("Save as") : action.payload.title;
        if (!title) return;

        state.selectedTab.title = title;

        state.isDataSaved = false;
    },

    saveRoomData : (state, action) => {
      let title = prompt("Save as");
      if (!title) return;

      
    },
    
      //synchronous
      handleOnChange :(state, action)=>{
          state.selectedTab.data = action.payload;
      },

      //form handleOnchange 

      handleFormOnchnage: (state, action) => {
        const { name, value } = action.payload; 
        state.userDetails[name] = value; 
    },
    
    makeFormEmpty :(state, action)=>{
        state.userDetails = {username : "", password : ""};
    },

    handleFetchedTabs :(state, action)=>{
      state.tabsData = action.payload
    },

      handleIsDataSaved :(state, action)=>{
        state.isDataSaved = true;
      },

      handleIsDataNotSaved :(state, action)=>{
        state.isDataSaved = false;
      },

      showDefaultTab : (state, action)=>{
          
          let lastTab = state.tabsData[0];
          state.selectedTab = {...lastTab};
      },

      setIsLoggedInTrue : (state, action)=>{
        state.isLoggedIn = true;
      },

      setIsLoggedInFalse : (state, action)=>{
          state.isLoggedIn = false;
      },

      setRoomname : (state, action)=>{
        state.roomname = action.payload;

      },

      setGroupType : (state, action)=>{
        state.groupType = action.payload || "Public";
      },

      resetRoomname : (state, action)=>{
        state.roomname = "";
      },

      setCollaboration :(state, action)=>{
        state.collaboration = action.payload;
      },

      resetCollaboration :(state, action)=>{
        state.collaboration = "yes";
      },

      makeAdmin : (state,action)=>{
        state.isAdmin = true;
      },

      undoAdmin : (state,action)=>{
        state.isAdmin = false;
      },

      setLoadTabs : (state, action)=>{
        state.loadTabs = false;
      }
    },

    //Extra Reducers (Asynchrounous)

    extraReducers :(builder)=>{

        builder
        
        .addCase(addnewTab.pending, (state)=>{
            state.loadTabs = true;
        })

        .addCase(addnewTab.fulfilled, (state, action)=>{
            state.loadTabs = false;
            state.tabsData.push(action.payload);
        })

        .addCase(addnewTab.rejected, (state, action)=>{
          console.log(action.payload)
            state.fetchError = "something went wrong";
            setTimeout(() => {
                state.fetchError = "";
                state.loadTabs = false;
            }, 3000);
        })

        // deleting tab

        .addCase(deleteTab.pending, (state)=>{
          state.loadTabs = true;
      })
      
      .addCase(deleteTab.fulfilled, (state, action)=>{
          state.loadTabs = false;
          let {_id} = action.payload;

          let idx = state.tabsData.findIndex((tab)=>tab._id === _id);

          state.tabsData = state.tabsData.filter((tab)=> tab._id !== _id);
           
          let nxtTab = idx === 0 ? 0 : idx - 1;
        
          const nextSelectedTab = state.tabsData[nxtTab];
          state.selectedTab = { ...nextSelectedTab };
    
      })

      .addCase(deleteTab.rejected, (state, action)=>{
        console.log(action.payload)

        state.fetchError = "something went wrong";
        setTimeout(() => {
            state.fetchError = "";
            state.loadTabs = false;
        }, 3000);
      })

      // save data

      .addCase(saveTabData.pending, (state)=>{
        state.loadTabs = true;
    })
    
    .addCase(saveTabData.fulfilled, (state, action) => {
      state.loadTabs = false;
      let { _id, title, data } = action.payload;
  
      state.tabsData = state.tabsData.map((tab) => 
         tab._id === _id ? { ...tab, title:title, data:data } : tab
      );

      
  })

    .addCase(saveTabData.rejected, (state, action)=>{
        state.loadTabs = false;
        console.log(action.payload)

        state.fetchError = "something went wrong";
            setTimeout(() => {
                state.fetchError = "";
                state.loadTabs = false;
            }, 3000);
    })
    }
  })
  

  export const {setUsername,addNewTab, selectedTab, saveData, handleOnChange, handleFormOnchnage, makeFormEmpty ,
    handleIsDataSaved , handleIsDataNotSaved,showDefaultTab, handleFetchedTabs, setIsLoggedInFalse, setIsLoggedInTrue, setRoomname, resetRoomname,
     makeAdmin, undoAdmin, setLoadTabs, setCollaboration, resetCollaboration, setGroupType} = tabSlice.actions
  
  export default tabSlice.reducer;