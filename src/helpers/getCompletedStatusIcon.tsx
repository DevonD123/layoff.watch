import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons";

const getCompltedStatusIcon = (is_completed: boolean, size?: number) => {
  return is_completed ? (
    <IconCircleCheck color="green" size={size || 14} />
  ) : (
    <IconAlertTriangle color="orange" size={size || 14} />
  );
};

export default getCompltedStatusIcon;
