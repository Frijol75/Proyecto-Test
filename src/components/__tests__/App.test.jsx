import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('CUPID AI - Pruebas de Componentes y Flujo de Usuario', () => {
  it('renderiza el encabezado CUPID AI y el formulario inicial de gustos', () => {
    render(<App />);

    expect(screen.getByText('CUPID AI')).toBeInTheDocument();
    expect(
      screen.getByText(/Define tus gustos para que CUPID AI encuentre tu match/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Tu Nombre/i)).toHaveValue('Alex Rivera');
  });

  it('muestra alerta de validacion cuando el perfil tiene datos incompletos', () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Tu Nombre/i);
    fireEvent.change(nameInput, { target: { value: 'A' } });

    const submitBtn = screen.getByRole('button', {
      name: /Analizar Perfil y Generar Match con IA/i
    });
    fireEvent.click(submitBtn);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Ingresa tu nombre \(minimo 2 caracteres\)/i
    );
  });

  it('permite seleccionar/deseleccionar gustos y generar el Match con IA', () => {
    render(<App />);

    const synthpopPill = screen.getByRole('button', { name: 'Synthpop' });
    expect(synthpopPill).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(synthpopPill);
    expect(synthpopPill).toHaveAttribute('aria-pressed', 'true');

    const submitBtn = screen.getByRole('button', {
      name: /Analizar Perfil y Generar Match con IA/i
    });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Tus Matches seleccionados por Inteligencia Artificial/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId('compatibility-score')).toHaveTextContent(
      /% Compatibilidad IA/i
    );
    expect(screen.getByTestId('ai-match-reason')).toBeInTheDocument();
    expect(screen.getByTestId('ai-icebreaker')).toBeInTheDocument();
  });

  it('permite aceptar un Match de IA, verlo en Mis Conexiones y enviar el rompehielos', () => {
    render(<App />);

    // Ir a Match con IA
    fireEvent.click(
      screen.getByRole('button', { name: /Analizar Perfil y Generar Match con IA/i })
    );

    const acceptBtn = screen.getByRole('button', { name: /Aceptar Match de IA/i });
    fireEvent.click(acceptBtn);

    // El contador de conexiones debe subir a 1
    expect(screen.getByTestId('connections-badge')).toHaveTextContent('1');

    // Navegar a la pestana Mis Conexiones
    fireEvent.click(screen.getByRole('button', { name: /Mis Conexiones/i }));

    expect(
      screen.getByText(/Tus Matches aceptados en CUPID AI/i)
    ).toBeInTheDocument();

    // Enviar el rompehielos generado por IA
    const sendIcebreakerBtn = screen.getByRole('button', {
      name: /Enviar rompehielos de IA/i
    });
    fireEvent.click(sendIcebreakerBtn);

    expect(screen.getByText(/Mensaje enviado/i)).toBeInTheDocument();
  });

  it('permite cambiar de candidato en el ranking lateral y descartar sugerencias hasta vaciar la lista', () => {
    render(<App />);

    // Primero revisar estado vacio de Mis Conexiones
    fireEvent.click(screen.getByRole('button', { name: /Mis Conexiones/i }));
    expect(
      screen.getByText(/Aun no tienes conexiones confirmadas/i)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Ir a mis Matches con IA/i }));

    // Seleccionar otro candidato desde el ranking
    const mateoRankingBtn = screen.getByRole('button', { name: /Mateo Salazar/i });
    fireEvent.click(mateoRankingBtn);

    expect(
      screen.getByRole('heading', { name: /Mateo Salazar, 25/i })
    ).toBeInTheDocument();

    // Descartar todos los candidatos (5 en total)
    for (let i = 0; i < 5; i += 1) {
      const nextBtn = screen.getByRole('button', { name: /Siguiente sugerencia/i });
      fireEvent.click(nextBtn);
    }

    expect(
      screen.getByText(/Has revisado todas las recomendaciones actuales de CUPID AI/i)
    ).toBeInTheDocument();

    // Restablecer sugerencias
    fireEvent.click(
      screen.getByRole('button', { name: /Restablecer sugerencias IA/i })
    );
    expect(screen.getByTestId('featured-match-card')).toBeInTheDocument();
  });
});
