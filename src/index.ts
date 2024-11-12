import ICAL from "ical.js";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

function processCalendar(cal: any, titleDoesNotContain: Array<string>): any {
	const vcalendar = new ICAL.Component(cal);
	const vevents = vcalendar.getAllSubcomponents("vevent");
	const newVevents = vevents.filter((vevent: any) => {
		const summary = vevent.getFirstPropertyValue("summary");
		return !titleDoesNotContain.some((word) => summary.includes(word));
	});
	vcalendar.removeAllSubcomponents("vevent");
	newVevents.forEach((vevent: any) => {
		vcalendar.addSubcomponent(vevent);
	});
	return vcalendar;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		// get url params
		const params = url.searchParams;
		
		try {
			const calUrlParam = params.get('cal');
			if (!calUrlParam) {
				return new Response("Client Error.", { status: 400 });
			}
			const calUrl = new URL(calUrlParam);
			const response = await fetch(calUrl.href);
			if (!response.ok) {
				throw new Error("Failed to fetch.");
			}
			if (!response.body) {
				throw new Error("Empty body.");
			}

			const body = await response.text();
			const jcal = ICAL.parse(body);
			
			const titleDoesNotContain = params.get('titleDoesNotContain')?.split(',') || [];

			const processedCalendarString = processCalendar(jcal, titleDoesNotContain).toString();
			return new Response(processedCalendarString, response);
		} catch (e) {
			console.log(e);
			return new Response("Client Error.", { status: 400 });
		}
	},
};
