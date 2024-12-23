import React from "react";
import { assets } from "../assets/assets";

function About() {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className="text-gray-500">
            Amelia Earhart Medical Center, a groundbreaking, state-of-the-art
            facility located in the heart of downtown Philadelphia, is committed
            to providing the best possible care for all patients.
          </p>
          <p className="text-gray-500">
            Our mission is to provide exceptional patient care, innovation, and
            quality services through innovative technology and expertise.
          </p>
          <b className="text-gray-800">Our Values</b>
          <p className="text-gray-500">
            Amelia Earhart Medical Center is a pioneering, innovative, and
            commitment to excellence in healthcare delivery.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span>CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>Efficiency:</b>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Asperiores iusto hic, nobis sequi ut velit, enim itaque corporis eligendi quidem nemo tenetur blanditiis. Ea quae fugiat nisi excepturi facilis voluptatum?</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>Convenience:</b>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim placeat expedita iusto aliquam officiis optio harum consequuntur facilis voluptatibus deleniti, vitae ducimus. Dolorem quaerat omnis officia dolores perferendis explicabo optio.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[-15px] hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b>Personalization</b>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid quo hic minima ipsa sint magnam optio natus repudiandae? Suscipit dicta culpa velit placeat ducimus reiciendis nulla provident earum vel est.</p>
        </div>
      </div>
    </div>
  );
}

export default About;
