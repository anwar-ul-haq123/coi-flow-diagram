// center = rotation center
// current = current position
// x, y = rotated positions
// angle = angle of rotation
export const rotate = (center, current, angle) => {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x =
    cos * (current.x - center.x) + sin * (current.y - center.y) + center.x;
  const y =
    cos * (current.y - center.y) - sin * (current.x - center.x) + center.y;
  return { x, y };
};
