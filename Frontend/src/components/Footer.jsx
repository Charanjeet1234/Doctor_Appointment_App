import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ------- Left section ------------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit ad
            suscipit ipsum doloremque nemo quae accusamus molestias quam
            pariatur cupiditate? Nesciunt animi, eius quam recusandae aspernatur
            alias voluptates esse perspiciatis?
          </p>
        </div>
        {/* ------- Center section ------------- */}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/* ------- Right section ------------- */}
        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+123456789</li>
            <li>Company@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* -------------CopyRight --------- */}

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright @2024 Prescripto | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
