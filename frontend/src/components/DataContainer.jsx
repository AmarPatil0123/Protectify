import React, { useEffect, useState, useRef } from 'react';
import "./DataContainer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {
    selectedTab, handleOnChange, handleIsDataSaved, handleIsDataNotSaved, showDefaultTab,
    saveData, addnewTab, deleteTab, saveTabData
} from '../features/tabs/tabSlice';
import { useDispatch, useSelector } from 'react-redux';
import SnackbarLoader from './SnackbarLoader';
import Loading from './Loading';

const DataContainer = () => {

    const inputRef = useRef(null);

    const tabs = useSelector((state) => state.tabs.tabsData);
    let selectedTabData = useSelector((state) => state.tabs.selectedTab);
    const checkDataSaved = useSelector((state) => state.tabs.isDataSaved);
    const { collaboration, loadTabs, fetchError } = useSelector((state) => state.tabs)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(showDefaultTab());
        inputRef.current.focus();
    }, [dispatch]);

    const [saveSnackbar, setSaveSnackbar] = useState(false);
    const [addTabSnackbar, setAddTabSnackbar] = useState(false);
    const [showTabs, setShowTabs] = useState(false);

    const handleAddTab = () => {

        if (checkDataSaved) {
            alert("Save the data first");
            return
        }
        dispatch(addnewTab(selectedTabData.owner));

        setTimeout(() => {
            setAddTabSnackbar(true);
        }, 400);

        setTimeout(() => {
            setAddTabSnackbar(false);
        }, 1000);

        setShowTabs(!showTabs);
        inputRef.current.focus();

    };

    const handleSave = () => {
        let title = selectedTabData.title === "Empty Tab" ? prompt("Save as") : selectedTabData.title;
        if (!title) return;

        if (title.length > 30) {
            alert("Title length should be less than 30 characters")
            return;
        }
        selectedTabData = { ...selectedTabData, title: title };
        dispatch(saveData(selectedTabData));

        dispatch(saveTabData({ tabId: selectedTabData._id, ownerId: selectedTabData.owner }));

        setTimeout(() => {
            setSaveSnackbar(true);
        }, 400);

        setTimeout(() => {
            setSaveSnackbar(false);
        }, 1000);

        inputRef.current.focus();

    };

    useEffect(() => {
        const unloadCallback = (event) => {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = '';
            }
            return '';
        };

        const handlePopState = () => {
            const confirmLeave = window.confirm("changes will not be saved?");
            if (!confirmLeave) {
                window.history.pushState(null, '', window.location.href);
            } else {
                dispatch(handleIsDataNotSaved());
                window.location.reload();
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener("beforeunload", unloadCallback);
        return () => {
            window.removeEventListener("beforeunload", unloadCallback);
            window.removeEventListener('popstate', handlePopState);

        }

    }, [checkDataSaved])

    return (
        <div className="DataContainer">

            <div className="input-container">
                <textarea
                    type="text"
                    ref={inputRef}
                    placeholder="Add data..."
                    onInput={() => dispatch(handleIsDataSaved())}
                    onChange={(e) => dispatch(handleOnChange(e.target.value))}
                    value={selectedTabData.data}
                    onClick={() => setShowTabs(false)}
                />
            </div>

            <FontAwesomeIcon icon={showTabs ? faXmark : faBars} className='toggler' onClick={() => setShowTabs(!showTabs)} />

            <div className={`tab-container ${showTabs ? "showTabs" : null}`}>
                <div className="btns">
                    <button
                        className="add"
                        title="Add New Tab"
                        onClick={handleAddTab}
                    >
                        Add
                    </button>
                    <button
                        className={`save ${checkDataSaved ? '' : 'activate'}`}
                        title="Save"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>


                <div className="tabs">
                    {tabs.map((tab) => (
                        <div
                            className="tab-outer"
                            key={tab._id}
                        >
                            <div
                                onClick={() => {
                                    inputRef.current.focus();
                                    dispatch(selectedTab(tab));
                                    setShowTabs(!showTabs);
                                }}

                                className={`tab ${selectedTabData._id === tab._id ? 'selectedTab' : ''
                                    }`}
                            >
                                {tab.title}
                            </div>
                            {tabs.length > 1 && (
                                <div
                                    className="delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        let sure = confirm("Are you sure you want to continue");
                                        if (!sure) return;
                                        dispatch(deleteTab({ tabId: tab._id, ownerId: tab.owner }));
                                        inputRef.current.focus();

                                    }}
                                >
                                    <FontAwesomeIcon icon={faSquareXmark} />
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            {saveSnackbar && <SnackbarLoader message="Data Saved" />}
            {addTabSnackbar && <SnackbarLoader message="New Tab Created" duration={1000} />}
            {loadTabs ? <Loading /> : null}
        </div>
    );
};

export default DataContainer;
