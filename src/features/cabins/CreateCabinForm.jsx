/* eslint-disable no-unused-vars */
import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    // الصورة بتيجي array
    const image = data.image[0];

    mutate({ ...data, image });
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      {/* Cabin name */}
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
        />
        {errors?.name && <Error>{errors.name.message}</Error>}
      </FormRow>

      {/* Max capacity */}
      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
            valueAsNumber: true,
          })}
        />
        {errors?.maxCapacity && (
          <Error>{errors.maxCapacity.message}</Error>
        )}
      </FormRow>

      {/* Regular price */}
      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
            valueAsNumber: true,
          })}
        />
        {errors?.regularPrice && (
          <Error>{errors.regularPrice.message}</Error>
        )}
      </FormRow>

      {/* Discount */}
      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            valueAsNumber: true,
            validate: (value, formValues) =>
              value <= formValues.regularPrice ||
              "Discount should be less than regular price",
          })}
        />
        {errors?.discount && <Error>{errors.discount.message}</Error>}
      </FormRow>

      {/* Description */}
      <FormRow>
        <Label htmlFor="description">Description for website</Label>
        <Textarea
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
        {errors?.description && (
          <Error>{errors.description.message}</Error>
        )}
      </FormRow>

      {/* Image */}
      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: "This field is required",
          })}
        />
        {errors?.image && <Error>{errors.image.message}</Error>}
      </FormRow>

      {/* Buttons */}
      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => reset()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {isCreating ? "Creating..." : "Add cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;