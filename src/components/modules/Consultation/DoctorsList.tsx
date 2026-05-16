"use client";
import { getDoctors } from '@/app/(commonLayout)/consultation/_actions';
import { useQuery } from '@tanstack/react-query';

const DoctorsList = () => {
  const { data } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  })
  console.log(data);

  //Non Pre Fetched Data Example
  // const { data: nonPrefetchedData } = useQuery({
  //   queryKey: ["doctors"],
  //   queryFn: () => getDoctors(),
  // });
  // console.log("NonPreFetchedData: ", nonPrefetchedData);
  return (
    <div>
      {data.data.map((doctor: any) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
};

export default DoctorsList;