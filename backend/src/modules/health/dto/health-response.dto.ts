export interface HealthResponseDto {
  status: "ok";
  service: string;
  database: "up";
  timestamp: string;
}
