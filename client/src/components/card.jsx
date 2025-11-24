import React from "react";
import { FaYoutube, FaLink } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

const CreatorCard = ({
  avatar,
  name,
  niche,
  TrendScore,
  followers,
  collaborations,
  youtubeLink,
  subscriberLink
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-[300px] hover:shadow-xl transition duration-300">
      {/* Profile Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <FiTrendingUp className="text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Trending: {TrendScore}</span>
        </div>
      </div>
      
      {/* Profile Image */}
      <div className="bg-gray-100 rounded-xl p-3 flex items-center justify-center mt-2">
        <img
          src={avatar}
          alt={name}
          className="h-28 w-28 object-cover rounded-full"
        />
      </div>

      {/* Creator Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{niche}</p>
      </div>

      {/* Stats */}
      <div className="flex justify-between mt-4 text-sm">
        <div>
          <p className="text-gray-400">Followers</p>
          <p className="font-semibold text-black">{followers}</p>
        </div>
        <div>
          <p className="text-gray-400">Collabs</p>
          <p className="font-semibold text-black">{collaborations}</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-4 flex space-x-3">
        <a 
          href={youtubeLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-red-500 hover:text-red-600"
        >
          <FaYoutube className="mr-1" /> YouTube
        </a>
        <a 
          href={subscriberLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <FaLink className="mr-1" /> Subscribers
        </a>
      </div>
    </div>
  );
};

export default CreatorCard;
