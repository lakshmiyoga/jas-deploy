import { createSlice } from "@reduxjs/toolkit";

const measurementSlice = createSlice({
    name: 'measurement',
    initialState: {
        postmeasurementloading: false,
        postmeasurement: null,
        postmeasurementerror: null,
        getmeasurementloading: false,
        getmeasurement: null,
        getmeasurementerror: null,
        deletemeasurementloading: false,
        deletemeasurement: null,
        deletemeasurementerror: null,
        updatemeasurementloading: false,
        updatemeasurement: null,
        updatemeasurementerror: null,
        singlemeasurement: null,     // State to hold single measurement data
        singlemeasurementLoading: false,     // Loading state for fetching single measurement
        singlemeasurementError: null,        // Error state for single measurement fetch
        isMeasurementUpdated: false,
    },
    reducers: {
        measurementPostRequest(state) {
            state.postmeasurementloading = true;
        },
        measurementPostSuccess(state, action) {
            state.postmeasurementloading = false;
            state.postmeasurement = action.payload;
        },
        measurementPostFail(state, action) {
            state.postmeasurementloading = false;
            state.postmeasurementerror = action.payload;
        },
        measurementGetRequest(state) {
            state.getmeasurementloading = true;
        },
        measurementGetSuccess(state, action) {
            state.getmeasurementloading = false;
            state.getmeasurement = action.payload;
        },
        measurementGetFail(state, action) {
            state.getmeasurementloading = false;
            state.getmeasurementerror = action.payload;
        },
        cleargetMeasurement(state, action) {
            state.getmeasurementloading = false;
            state.getmeasurementerror = null;
            state.getmeasurement = null;
        },
        clearPostMeasurement(state, action) {
            state.postmeasurementloading = false;
            state.postmeasurement = null;
            state.postmeasurementerror = null;
        },
        measurementDeleteRequest(state) {
            state.deletemeasurementloading = true;
        },
        measurementDeleteSuccess(state, action) {
            state.deletemeasurementloading = false;
            state.deletemeasurement = action.payload;
        },
        measurementDeleteFail(state, action) {
            state.deletemeasurementloading = false;
            state.deletemeasurementerror = action.payload;
        },
        clearDeleteMeasurement(state, action) {
            state.deletemeasurementloading = false;
            state.deletemeasurementerror = null;
            state.deletemeasurement = null;
        },
        measurementUpdateRequest(state) {
            state.updatemeasurementloading = true;
        },
        measurementUpdateSuccess(state, action) {
            state.updatemeasurementloading = false;
            state.updatemeasurement = action.payload;
            state. isMeasurementUpdated = true;
        },
        measurementUpdateFail(state, action) {
            state.updatemeasurementloading = false;
            state.updatemeasurementerror = action.payload;
        },
        clearupdateMeasurement(state, action) {
            state.updatemeasurementloading = false;
            state.updatemeasurementerror = null;
            state.updatemeasurement = null;
            state. isMeasurementUpdated = false;
        },
        measurementSingleRequest: (state) => {
            state.singlemeasurementLoading = true;
            state.singlemeasurementError = null;
        },
        measurementSingleSuccess: (state, action) => {
            state.singlemeasurementLoading = false;
            state.singlemeasurement = action.payload;
        },
        measurementSingleFail: (state, action) => {
            state.singlemeasurementLoading = false;
            state.singlemeasurementError = action.payload;
        },

    },
});

const { actions, reducer } = measurementSlice;

export const {
    measurementPostRequest,
    measurementPostSuccess,
    measurementPostFail,
    measurementGetRequest,
    measurementGetSuccess,
    measurementGetFail,
    clearPostMeasurement,
    measurementDeleteRequest,
    measurementDeleteSuccess,
    measurementDeleteFail,
    clearDeleteMeasurement,
    cleargetMeasurement,
    clearupdateMeasurement,
    measurementUpdateRequest,
    measurementUpdateSuccess,
    measurementUpdateFail,
    measurementSingleRequest,
    measurementSingleSuccess,
    measurementSingleFail,

} = actions;

export default reducer;
