export interface ResponseEnvelope<TData> {
  data: TData;
}

export const toResponseEnvelope = <TData>(data: TData): ResponseEnvelope<TData> => ({
  data,
});
