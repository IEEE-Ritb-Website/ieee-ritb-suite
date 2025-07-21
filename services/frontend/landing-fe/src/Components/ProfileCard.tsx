import React from "react";
import "./ProfileCard.css";
type FacultyCardProps = {
  name: string;
  chapter: string;
  imageUrl: string;
};

const FacultyCard: React.FC<FacultyCardProps> = ({
  name,
  chapter,
  imageUrl,
}) => {
  return (
    <div className="content">
      <div className="card">
        <div className="firstinfo">
          <img src={imageUrl} alt={`Profile of ${name}`} />
          <div className="profileinfo">
            <h1>{name}</h1>
            <h3>{chapter}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
