import { configureStore } from "@reduxjs/toolkit";
import ZayavkiSlicer from "../Reducer/Zayavkilist";
import OtziviSlicer from "../Reducer/Otzivilist";
import BannerSlicer from "../Reducer/Bannerlist";
import ChooseSlicer from "../Reducer/ChooseUslist";
import ColleaguesSlicer from "../Reducer/Colleagueslist";
import  CourseSlicer  from "../Reducer/Courselist";
import  GallerySlicer from "../Reducer/Gallerylist";
import  NewsSlicer  from "../Reducer/Newslist";

export const store = configureStore({
  reducer: {
    ZayavkiSlicer,
    OtziviSlicer,
    BannerSlicer,
    ChooseSlicer,
    ColleaguesSlicer,
    CourseSlicer,
    GallerySlicer,
    NewsSlicer
  },
});
