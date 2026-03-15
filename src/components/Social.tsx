import Link from "next/link";

import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const socials = [
  { icon: <FaGithub />, path: "https://github.com/danielmai12" },
  {
    icon: <FaLinkedin />,
    path: "https://www.linkedin.com/in/daniel-mai-1201/",
  },
  // { icon: <FaYoutube />, path: "" },
  { icon: <FaTwitter />, path: "https://x.com/dmai1201" },
  { icon: <SiLeetcode />, path: "https://leetcode.com/u/DanielMai/" },
];

/**
 * Social component to render social media icons
 * @param {string} containerStyles - Styles for the container
 * @param {string} iconStyles - Styles for the icons
 * @returns JSX.Element
 */
const Social = ({
  containerStyles,
  iconStyles,
}: {
  containerStyles: string;
  iconStyles: string;
}) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => (
        <Link href={item.path} key={index} className={iconStyles}>
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default Social;
