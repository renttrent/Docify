import { Button } from "react-bootstrap";
import React from "react";

const GenerateLink = ({
  match: {
    params: { hash },
  },
}) => {
  return (
    <div>
      {{ hash }}
      <Button>Ku jam</Button>
    </div>
  );
};

export default GenerateLink;
