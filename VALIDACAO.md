# Validação de Funcionalidades - PoliMap React

Comparação com **polimap-godot** (referência completa).

## ✅ Implementado

| Funcionalidade | Godot | React | Notas |
|----------------|-------|-------|-------|
| **Navegação autônoma** | `enable_autopilot`, `NavigationAgent3D` | Autopilot em linha reta | Mesmo mapa: personagem caminha até destino |
| **Reposicionamento** | `teleport_to` | Teleporte instantâneo | Botão "Reposicionar" no modal |
| **Troca de cena** | `_change_map` | `currentScene` + `setCurrentScene` | Carrega modelo GLB por sala |
| **Modal de navegação** | `NavigationMenu` | `NavigationModal` | Bloco → Andar → Sala |
| **Menu de pausa** | `PauseMenu` | `PauseMenu` | ESC, Continuar, Instruções, Reiniciar, Sair |
| **Inspect POI** | `InspectMenu` | `InspectMenu` | Nome, descrição, fotos, curiosidade |
| **Pontos de interesse** | `PointOfInterestResource` | `PoiInfo` em Room | description, photos, curiosity, dates, sectors |
| **Map Editor** | - | `MapEditor` | Blocos, andares, salas, gates |
| **Gates Editor** | - | `GatesEditor` | Adicionar gates por sala |
| **Game State** | `GameStateController` | `GameStateContext` | WALKING, PAUSE_MENU, NAVIGATION_MENU, IN_DIALOG |
| **Bloqueio de movimento** | `can_player_move` | `canMove` | Personagem parado quando menu aberto |
| **Atalhos** | ESC, B, M, E | ESC, M, B, E | M/B: mapa, ESC: pausa, E: interagir |
| **Colisões** | Physics | Rapier (trimesh + capsule) | Mapa e personagem |
| **Personagem** | `PlayerController` | `CharacterController` | WASD, Shift, Space |

## ⚠️ Parcialmente implementado

| Funcionalidade | Status |
|----------------|--------|
| **Interação (E)** | Tecla mapeada, mas falta detecção de proximidade com POI/Portal. Requer áreas de colisão nos POIs. |
| **Map Menu** | Godot tem mapa visual com botões por POI. React usa NavigationModal (lista). |
| **Pathfinding** | Godot usa A* + navmesh. React usa movimento em linha reta (pode colidir com obstáculos). |

## ❌ Não implementado (Godot específico)

| Funcionalidade | Motivo |
|----------------|--------|
| **Virtual Joystick** | Mobile - addon Godot |
| **Diálogos** | Dialogue Manager addon |
| **Múltiplos mapas com portais** | Godot carrega cenas dinamicamente. React usa um modelo por vez. |
| **Grafo de portais A*** | Navegação entre mapas via portais - estrutura diferente |
| **Som de passos** | `play_step_sound` |
| **Controle de câmera com mouse** | Câmera fixa atrás do personagem |

## Fluxo de navegação

- **Reposicionar**: Teleporte instantâneo (mesmo ou outro mapa)
- **Navegar**: 
  - Mesmo mapa → autopilot (caminhada até `interest_point`)
  - Outro mapa → teleporte (equivalente a Reposicionar)
