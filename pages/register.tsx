import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import HeadOfPage from '@/components/shared/HeadOfPage';
import InputTextControl from '@/components/shared/InputTextControl';
import axios from 'axios';
import { auth } from '@/services/auth';
import { REGISTER_CONTENT, REGISTER_EMAIL_PLACEHOLDER, REGISTER_INVALID_CREDENTIALES, REGISTER_LOGIN_BTN, REGISTER_NAME_PLACEHOLDER, REGISTER_PWD_PLACEHOLDER, REGISTER_SIGNUP_BTN, REGISTER_TITLE } from '@/components/constants';

interface IControllerRegister {
  name?: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {

  const { data: session } = useSession()
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router]);

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
        setError('email', { message: REGISTER_INVALID_CREDENTIALES });
        setError('password', { message: REGISTER_INVALID_CREDENTIALES });
        return;
      }
    }

    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then(({ error }: any) => {
      if (error) {
        setError('email', { message: REGISTER_INVALID_CREDENTIALES });
        setError('password', { message: REGISTER_INVALID_CREDENTIALES });
        return;
      } else {
        router.push('/');
      }
    });
  };

  return (
    <HeadOfPage title={REGISTER_TITLE} content={REGISTER_CONTENT}>
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
                rules={{ required: "Este campo es requerido." }}
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
                    placeholder={REGISTER_NAME_PLACEHOLDER}
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name='email'
              rules={{ required: "Este campo es requerido." }}
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
                  placeholder={REGISTER_EMAIL_PLACEHOLDER}
                />
              )}
            />
            <Controller
              control={control}
              name='password'
              rules={{ required: "Este campo es requerido." }}
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
                  placeholder={REGISTER_PWD_PLACEHOLDER}
                  isPassword={true}
                />
              )}
            />
          </div>
          <button className='register__form__button' type='submit'>
            {isMember ? REGISTER_LOGIN_BTN : REGISTER_SIGNUP_BTN}
          </button>
          <h3 className='register__form__toggle'>
            {isMember ? "No" : 'Ya'} tienes una cuenta?{' '}
            <span
              className='register__form__toggle__button'
              onClick={() => setIsMember(!isMember)}
            >
              {isMember ? REGISTER_SIGNUP_BTN : REGISTER_LOGIN_BTN}
            </span>
          </h3>
        </form>
      </main>
    </HeadOfPage>
  );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await auth(
        context.req,
        context.res,
      ),
    },
  }
};

export default Register;
