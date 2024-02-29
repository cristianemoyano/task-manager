import { useState } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { isEmpty } from 'lodash';

import HeadOfPage from '@/components/shared/HeadOfPage';
import InputTextControl from '@/components/shared/InputTextControl';
import axios from 'axios';

interface IControllerRegister {
  name?: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {

  const router = useRouter();

  const [isMember, setIsMember] = useState(true);

  const { control, handleSubmit, setError } = useForm<IControllerRegister>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });


  const onSubmit: SubmitHandler<IControllerRegister> = async (data) => {
    if (!isMember) {
      try {
        await axios.post('/api/auth/register', { ...data });
      } catch (error) {
        setError('email', { message: 'invalid credentials' });
        setError('password', { message: 'invalid credentials' });
        return;
      }
    }

    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then(({ error }: any) => {
      if (error) {
        setError('email', { message: 'invalid credentials' });
        setError('password', { message: 'invalid credentials' });
        return;
      } else {
        router.push('/');
      }
    });
  };

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
          <h3 className='register__form__toggle'>
            Access the app without login or sign up?{' '}
            <span
              className='register__form__toggle__button'
              onClick={() =>
                signIn('credentials', {
                  email: process.env.NEXT_PUBLIC_EMAIL,
                  password: process.env.NEXT_PUBLIC_PASSWORD,
                  redirect: false,
                })
              }
            >
              Click me
            </span>
          </h3>
        </form>
      </main>
    </HeadOfPage>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!isEmpty(session?.id)) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }


  return {
    props: {
    },
  };
};

export default Register;
