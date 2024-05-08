import Image from "next/image";
import { useState } from "react";
import styles from "./index.module.scss";
import Form, { Field } from "rc-field-form";
import Radio from "@/components/Radio";
import Text from "@/components/Text";
import { Questions } from "@/utils/model/courses";
import { convert } from "html-to-text";

interface StudingProps {
  form: any;
  id: number;
  questions: Questions;
}

const OneQuestion: React.FC<StudingProps> = ({ form, id, questions }) => {
  const [question, setQuestion] = useState<string | null>(null);
  const listQuestion = [
    {
      label: convert(convert(questions?.answer_a)),
      value: "A",
    },
    {
      label: convert(convert(questions?.answer_b)),
      value: "B",
    },
    {
      label: convert(convert(questions?.answer_c)),
      value: "C",
    },
    {
      label: convert(convert(questions?.answer_d)),
      value: "D",
    },
  ];

  return (
    <div className={styles.question}>
      <Field
        name={id}
        rules={[
          {
            required: true,
            message: "",
          },
        ]}
      >
        {({}, meta) => {
          const { errors } = meta;
          const onChangeRadio = (value: string) => {
            setQuestion(value);
            form.setFields([
              {
                name: id,
                value: value,
                errors: [],
              },
            ]);
          };
          return (
            <div>
              <Text type="title-20-bold" color="neutral-3" bottom={10}>
                {convert(convert(questions?.question))}
              </Text>
              <div className={styles.questionRadio}>
                {listQuestion?.map((questionRadio) => {
                  return (
                    <div
                      className={styles.item}
                      key={`question-radio-${questionRadio?.label}`}
                    >
                      <Radio
                        value={questionRadio?.value}
                        gender={question}
                        onChange={onChangeRadio}
                        label={questionRadio?.label}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </Field>
    </div>
  );
};

export default OneQuestion;