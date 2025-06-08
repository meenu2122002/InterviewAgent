import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewByInterviewId } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({params}:RouteParams) => {
    const {id}=await params;
    const user=await getCurrentUser();
    const interview=await getInterviewByInterviewId(id);
    if(!interview)
        redirect('/');
    const feedback=await getFeedbackByInterviewId({
        interviewId:id,
        userId:user?.id!,
    });
    console.log(feedback);
  return (
    <div>Page</div>
  )
}

export default Page