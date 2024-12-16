import "./Leaderboard.css";

// define the type of leaderboard entries, depends on how backend passes it, for now defined as username and points
interface LeaderboardEntry {
  name: string;
  points: number;
}

interface LeaderboardProps {
  users: LeaderboardEntry[]; // the list of users for the leaderboard
}

export default function Leaderboard({ users }: LeaderboardProps) {
  // sort the users by points in descending order
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <>
      <ol>
        {sortedUsers.map((user, index) => (
          <li key={index}>
            <span className="rank">{index + 1}</span>
            {user.name} - {user.points} points
          </li>
        ))}
      </ol>
    </>
  );
}
