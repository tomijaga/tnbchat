import React, {FC} from 'react';
import Tag from 'antd/es/tag';

type CustomTagTypes = 'gov';
const tags: {
  [P in CustomTagTypes]: {color: string; content: string};
} = {
  gov: {color: 'gold', content: 'Gov'},
};

export const CustomTags: FC<{onClick?: (e: any) => void; type: CustomTagTypes}> = ({onClick, type}) => {
  const selectedTagDetails = tags[type];
  const {color, content} = selectedTagDetails;

  return (
    <Tag onClick={onClick} color={color}>
      {content}
    </Tag>
  );
};
