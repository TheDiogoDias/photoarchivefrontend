import React, {useState} from "react";
import {Box, Form, Text, FormField, RangeInput} from 'grommet';

const Test = () => {

    const [test, setTest] = useState(100);

    return(
        <Box pad="large">
            <Form
                >
                <FormField label="ISO" name="iso">
                    <RangeInput 
                        value={test}
                        onchange={(event) => setTest(event.target.value)}
                        min="100"
                        max="10000"
                        step="50"
                        name="iso"
                    />
                    <Text>{test}</Text>
                </FormField>
            </Form>
        </Box>
    );

}

export default Test;