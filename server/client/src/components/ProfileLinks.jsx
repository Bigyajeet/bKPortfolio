import { api } from "../Api";

const profiles = [
  { name: "GitHub", url: "https://github.com/Bigyajeet" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/bigyajeet-kumar-patra-307b85287/",
  },
  { name: "LeetCode", url: "https://leetcode.com/u/bigyajeet_patra/" },
  {
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/user/bigyajeet36/",
  },
];

export default function ProfileLinks({ className = "" }) {
  const track = (label) => {
    api("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "profile_click", label }),
    });
  };
  return (
    <div className={`links ${className}`}>
      {profiles.map((p) => (
        <a
          key={p.name}
          className="chip"
          target="_blank"
          rel="noreferrer"
          href={p.url}
          onClick={() => track(p.name)}
          title={p.name}
        >
          {p.name}
        </a>
      ))}
    </div>
  );
}
