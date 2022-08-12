import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import HeadOfPage from '@/components/shared/HeadOfPage';
import InputTextControl from '@/components/shared/InputTextControl';

interface IControllerRegister {
  name?: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {
  const [isMember, setIsMember] = useState(true);

  const { control, handleSubmit } = useForm<IControllerRegister>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = () => {};

  return (
    <HeadOfPage title='Login / Register' content='login or create an account'>
      <main className='register'>
        <Image
          src='/assets/logo-mobile.svg'
          width={24}
          height={25}
          layout='fixed'
          alt='company-logo'
          className='register__logo'
        />
        <form onSubmit={handleSubmit(onSubmit)} className='register__form'>
          <h1 className='register__form__title'>
            {isMember ? 'Login' : 'Sign Up'}
          </h1>
          <div className='register__form__container'>
            {!isMember && (
              <Controller
                control={control}
                name='name'
                rules={{ required: "can't be empty" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <InputTextControl
                    onChange={onChange}
                    value={value}
                    error={error}
                    name='name'
                    label='Name'
                    placeholder='Your name'
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name='email'
              rules={{ required: "can't be empty" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <InputTextControl
                  onChange={onChange}
                  value={value}
                  error={error}
                  name='email'
                  label='Email'
                  placeholder='Your email'
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              rules={{ required: "can't be empty" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <InputTextControl
                  onChange={onChange}
                  value={value}
                  error={error}
                  name='password'
                  label='Passord'
                  placeholder='Your password'
                  isPassword={true}
                />
              )}
            />
          </div>
          <button className='register__form__button' type='submit'>
            {isMember ? 'Login to your account' : 'Create an account'}
          </button>
          <h3 className='register__form__toggle'>
            {isMember ? "Don't" : 'Already'} have an account?{' '}
            <span
              className='register__form__toggle__button'
              onClick={() => setIsMember(!isMember)}
            >
              {isMember ? 'Sign Up' : 'Login'}
            </span>
          </h3>
        </form>
      </main>
    </HeadOfPage>
  );
};

export default Register;
