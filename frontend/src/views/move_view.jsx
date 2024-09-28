import React, { useEffect, useState } from "react";
import NavigationBar from '../components/shared/navigation_bar'
import Form_container from '../components/shared/form_container'
import Function_button from '../components/shared/function_button'
import Text_field from '../components/shared/text_field'

const Move_view = () => {

  const [formData, setFormData] = useState({ Name: '', Email: '' });

  const handleChange = (e) => {
    const { label, value } = e.target;
    console.log(`Field: ${label}, Value: ${value}`);
    setFormData({
      ...formData,
      [label]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div>
      <h1>Move Device</h1>
      <Form_container onSubmit={handleSubmit} cardSx={{ maxWidth: 600, boxShadow: 5 }}>
      <Text_field
        label="Name"
        value={formData.Name}
        onChange={handleChange}
      />
      <Text_field
        label="Email"
        value={formData.Email}
        onChange={handleChange}
      />
      <Function_button text="submit" type="input"/>
    </Form_container>
    </div>
  );
};

export default Move_view;