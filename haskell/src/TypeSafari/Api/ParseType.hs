{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE RecordWildCards #-}

module TypeSafari.Api.ParseType where

import Data.Aeson
import GHC.Generics
import Data.Text (Text)
import Prelude
import TypeSafari.HindleyMilner.Parse (parseType, ParseTypeResult (..), ParseError)
import TypeSafari.HindleyMilner.Syntax.Concrete (LocatedType, convertPoly, runConvert, SyntaxError)
import TypeSafari.Pretty (Pretty(..))
import TypeSafari.Parse.Span (Span)

--------------------------------------------------------------------------------

newtype Input = Input {
    inputText :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass FromJSON

data Output = Output {
    outputTypeConcrete :: Maybe LocatedType,
    outputTypeAbstract :: Maybe Text,
    outputError :: Maybe OutputError
  }
  deriving stock (Generic)
  deriving anyclass ToJSON

data OutputError
  = OutputParseError ParseError
  | OutputSyntaxError (SyntaxError Span)
  | OutputUnknownError Text
  deriving stock (Generic)
  deriving anyclass (ToJSON)

--------------------------------------------------------------------------------

run :: Input -> IO Output
run Input{..} = pure $
  case parseType inputText of
    Left err ->
      Output {
        outputTypeConcrete = Nothing,
        outputTypeAbstract = Nothing,
        outputError = Just (OutputParseError err)
      }
    Right ParseTypeResult{ parsedType } ->
      case runConvert (convertPoly parsedType) of
        Left err -> Output {
          outputTypeConcrete = Just parsedType,
          outputTypeAbstract = Nothing,
          outputError = Just (OutputSyntaxError err)
        }
        Right t -> Output {
          outputTypeConcrete = Just parsedType,
          outputTypeAbstract = Just $ pretty t,
          outputError = Nothing
        }

dispError :: Text -> Output
dispError t =
  Output {
    outputTypeConcrete = Nothing,
    outputTypeAbstract = Nothing,
    outputError = Just (OutputUnknownError t)
  }