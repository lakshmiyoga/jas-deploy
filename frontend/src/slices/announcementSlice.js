import { createSlice } from "@reduxjs/toolkit";

const announcementSlice = createSlice({
    name: 'announcement',
    initialState: {
        postAnnouncementLoading: false,
        postAnnouncement: null,
        postAnnouncementError: null,
        getAnnouncementLoading: false,
        getAnnouncement: null,
        getAnnouncementError: null,
        deleteAnnouncementLoading: false,
        deleteAnnouncement: null,
        deleteAnnouncementError: null,
        updateAnnouncementLoading: false,
        updateAnnouncement: null,
        updateAnnouncementError: null,
        singleAnnouncement: null,     // State to hold single category data
        singleAnnouncementLoading: false,     // Loading state for fetching single category
        singleAnnouncementError: null,        // Error state for single category fetch
        isAnnouncementUpdated: false,
    },
    reducers: {
        announcementPostRequest(state) {
            state.postAnnouncementLoading = true;
        },
        announcementPostSuccess(state, action) {
            state.postAnnouncementLoading = false;
            state.postAnnouncement = action.payload;
        },
        announcementPostFail(state, action) {
            state.postAnnouncementLoading = false;
            state.postAnnouncementError = action.payload;
        },
        announcementGetRequest(state) {
            state.getAnnouncementLoading = true;
        },
        announcementGetSuccess(state, action) {
            state.getAnnouncementLoading = false;
            state.getAnnouncement = action.payload;
        },
        announcementGetFail(state, action) {
            state.getAnnouncementLoading = false;
            state.getAnnouncementError = action.payload;
        },
        clearGetannouncement(state, action) {
            state.getAnnouncementLoading = false;
            state.getAnnouncementError = null;
            state.getAnnouncement = null;
        },
        clearPostannouncement(state, action) {
            state.postAnnouncementLoading = false;
            state.postAnnouncement = null;
            state.postAnnouncementError = null;
        },
        announcementDeleteRequest(state) {
            state.deleteAnnouncementLoading = true;
        },
        announcementDeleteSuccess(state, action) {
            state.deleteAnnouncementLoading = false;
            state.deleteAnnouncement = action.payload;
        },
        announcementDeleteFail(state, action) {
            state.deleteAnnouncementLoading = false;
            state.deleteAnnouncementError = action.payload;
        },
        clearDeleteAnnouncement(state, action) {
            state.deleteAnnouncementLoading = false;
            state.deleteAnnouncementError = null;
            state.deleteAnnouncement = null;
        },
        announcementUpdateRequest(state) {
            state.updateAnnouncementLoading = true;
        },
        announcementUpdateSuccess(state, action) {
            state.updateAnnouncementLoading = false;
            state.updateAnnouncement = action.payload;
            state.isAnnouncementUpdated = true;
        },
        announcementUpdateFail(state, action) {
            state.updateAnnouncementLoading = false;
            state.updateAnnouncementError = action.payload;
        },
        clearupdateAnnouncement(state, action) {
            state.updateAnnouncementLoading = false;
            state.updateAnnouncementError = null;
            state.updateAnnouncement = null;
            state.isAnnouncementUpdated = false;
        },
        announcementSingleRequest: (state) => {
            state.singleAnnouncementLoading = true;
            state.singleAnnouncementError = null;
        },
        announcementSingleSuccess: (state, action) => {
            state.singleAnnouncementLoading = false;
            state.singleAnnouncement = action.payload;
        },
        announcementSingleFail: (state, action) => {
            state.singleAnnouncementLoading = false;
            state.singleAnnouncementError = action.payload;
        },

    },
});

const { actions, reducer } = announcementSlice;

export const {
    announcementPostRequest,
    announcementPostSuccess,
    announcementPostFail,
    announcementGetRequest,
    announcementGetSuccess,
    announcementGetFail,
    clearGetannouncement,
    clearPostannouncement,
    announcementDeleteRequest,
    announcementDeleteSuccess,
    announcementDeleteFail,
    clearDeleteAnnouncement,
    announcementUpdateRequest,
    announcementUpdateSuccess,
    announcementUpdateFail,
    clearupdateAnnouncement,
    announcementSingleRequest,
    announcementSingleSuccess,
    announcementSingleFail,

} = actions;

export default reducer;