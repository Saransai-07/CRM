

const startCall = async (
  scsNumber: string,
  studentContactId: number | null,
  BASE_URL: string,
  accessToken: string
) => {
  const url = studentContactId
    ? `${BASE_URL}/call/wizklub_calling/?scsnumber=${scsNumber}&student_contact_id=${studentContactId}`
    : `${BASE_URL}/call/wizklub_calling/?scsnumber=${scsNumber}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== "success" || !data.correlationId) {
    throw new Error("Invalid response");
  }

  return data.correlationId;
};
export default startCall;


export const pollCallStatus = async (
  correlationId: string,
  BASE_URL: string,
  accessToken: string,
  onUpdate: (status: boolean) => void,
  controller: AbortController
) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  while (!controller.signal.aborted) {
    try {
      const res = await fetch(
        `${BASE_URL}/call/is_call_end/?correlation_id=${correlationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        }
      );

      const data = await res.json();

      onUpdate(data.is_call_end);

      if (data.is_call_end) return;

      await delay(1000);
    } catch (err: any) {
      if (err.name === "AbortError") break;
      await delay(1000);
    }
  }
};

