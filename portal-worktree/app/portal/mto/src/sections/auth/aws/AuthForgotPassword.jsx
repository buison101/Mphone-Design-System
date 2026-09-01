import { useState, useEffect } from 'react';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';

// ============================|| AWS - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const intl = useIntl();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  useEffect(() => {
    localStorage.removeItem('email');
    localStorage.removeItem('error');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setIsLoading(true);
          localStorage.setItem('email', values.email);
          try {
            if (forgotPassword) {
              await forgotPassword(values.email);
              setStatus({ success: true });
              setSubmitting(false);
              openSnackbar({
                open: true,
                message: 'Check mail for verification code',
                variant: 'alert',

                alert: {
                  color: 'success'
                }
              });

              setTimeout(() => {
                navigate(auth ? `/${auth}/reset-password?auth=aws` : '/reset-password', { replace: true });
              }, 1500);
            }
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-forgot">
                    <FormattedMessage id="auth.field.email" />
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="email-forgot"
                    error={Boolean(touched.email && errors.email)}
                    required
                    type="email"
                    value={values.email}
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={intl.formatMessage({ id: 'auth.placeholder.email' })}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-forgot">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid sx={{ mb: -2 }} size={12}>
                <Typography variant="caption">
                  <FormattedMessage id="auth.forgot.spamHint" />
                </Typography>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                    <FormattedMessage id="auth.code.send" />
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
