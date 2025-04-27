import { SegmentDto } from "./segment.dto";

export interface WalkingSegmentDto extends SegmentDto {
  distance: number;
  duration: number;
}
