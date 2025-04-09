import {createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {Route} from "@/helpers/Route";
import {FetchData} from "@/helpers/FetchData";

export const fetchAccountData = createAsyncThunk(
    "account/fetchData",
    async (datas, thunkAPI) => {
        try {

            const response= await FetchData.getData(
                Route.me
            );

            if(response?.name=="AxiosError"){
                return thunkAPI.rejectWithValue(response.response.data.message);
            }

            return response

        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }
);


const accountSlice = createSlice({
    name: "account-user",
    initialState: {
        loading: true,
        data: null,
        error: null,
        message: null,
        isAuth: false,
        token: null
    },
    reducers: {
        getAccount: (state, action) => {
            return state;
        },
        updateAccount: (state, action) => {
            state.data = action.payload
            return state
        },
        resetMessagesAccount: (state) => {
            state.message = null;
        },
        setIsAuth: (state, action) => {
            state.isAuth = action.payload
            return state
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccountData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccountData.fulfilled, (state, action) => {
                state.loading = false;

                state.data = action.payload.user;
                state.isAuth = true

            })
            .addCase(fetchAccountData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuth = false
            })
        ;
    },
});

export const {setIsAuth}=accountSlice.actions

export default accountSlice.reducer




