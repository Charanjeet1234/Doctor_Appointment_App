import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);

  // Arrow function to find the doctor with specific id
  const findDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  // use hook to see if is there any change in doctors or docId
  useEffect(() => {
    findDocInfo();
  }, [doctors, docId]);
  return docInfo && ( 
  <div>
    {/* Doctor Details */}
    <div>
    <div>
      <img src={docInfo.image} alt="" />
    </div>
<div>
    {/* ------Doc Info : name , degree , experience ...... */}
    <p>{docInfo.name} <img src={assets.verified_icon} alt="" /></p>
    <div>
      <p>{docInfo.degree} - {docInfo.speciality}</p>
     <button>{docInfo.experience}</button>
    </div>

    {/* ----- Doct about ----------- */}

    <p>About <img src={assets.info_icon} alt="" /></p>
    <p></p>
    </div>
    </div>

  </div>
  )
};

export default Appointment;
