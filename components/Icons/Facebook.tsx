import React from 'react';
import type { SVGProps } from 'react';

export function FacebookLogo(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}><path strokeDasharray={24} strokeDashoffset={24} d="M17 4l-2 0c-2.5 0 -4 1.5 -4 4v12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M8 12h7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="8;0"></animate></path></g></svg>);
}