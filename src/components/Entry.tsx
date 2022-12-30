import { type Entry } from '../types';

const EntryComponent = ({ entry }: { entry: Entry }) => {
  if (entry.diagnosisCodes) {
    console.log(entry.diagnosisCodes);
  }
  return (
    <div>
      {entry.date}: {entry.description}
      <ul>
        {entry.diagnosisCodes?.map((dc) => {
          return <li key={dc}>{dc}</li>;
        })}
      </ul>
    </div>
  );
};

export default EntryComponent;
